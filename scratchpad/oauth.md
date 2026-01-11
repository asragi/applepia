# Google OAuth + PKCE 認証実装計画

## 概要

既存のID/パスワード認証と並行運用するGoogle OAuth認証を実装する。
- 認証方式: Authorization Code + PKCE
- 端末にID/パスワード保存、Google連携で端末移行可能
- API通信: gRPC-Web（既存）+ HTTPエンドポイント（OAuth用）
- トークン保存: localStorage

---

## 認証フロー

```
[Frontend]                     [Backend HTTP]              [Google]
    │                               │                         │
    │ 1. code_verifier生成           │                         │
    │ 2. code_challenge計算          │                         │
    │                               │                         │
    ├──────────────────────────────────────────────────────────►│
    │ 3. 認可リクエスト (client_id, redirect_uri,               │
    │    code_challenge, state)                                │
    │                               │                         │
    │◄─────────────────────────────────────────────────────────┤
    │ 4. 認可コード返却               │                         │
    │                               │                         │
    ├──────────────────►│           │                         │
    │ 5. POST /auth/google/callback │                         │
    │    (code, code_verifier)      │                         │
    │                               ├─────────────────────────►│
    │                               │ 6. トークン交換           │
    │                               │◄────────────────────────┤
    │                               │ 7. id_token検証          │
    │                               │ 8. ユーザー作成/紐付け    │
    │                               │ 9. 内部JWT発行           │
    │◄──────────────────┤           │                         │
    │ 10. JWT返却        │           │                         │
```

---

## Phase 1: バックエンド基盤

### 1.1 DBスキーマ追加

**ファイル**: `dev/backend/docker/mysql/init/00_init.sql`

```sql
CREATE TABLE IF NOT EXISTS ringo.user_oauth_links
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `user_id`     varchar(40)  NOT NULL,
    `provider`    varchar(20)  NOT NULL,  -- 'google'
    `provider_id` varchar(255) NOT NULL,  -- Google sub
    `email`       varchar(255),
    `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE (`provider`, `provider_id`),
    INDEX `user_id_index` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
```

### 1.2 OAuth パッケージ作成

**新規ディレクトリ**: `dev/backend/oauth/`

| ファイル | 内容 |
|---------|------|
| `models.go` | OAuthLink, GoogleTokenResponse 等の型定義 |
| `repositories.go` | FindByGoogleId, InsertOAuthLink 等のインターフェース |
| `google.go` | Google OAuth クライアント（トークン交換、id_token検証） |
| `handler.go` | HTTPハンドラー（Callback, LinkAccount） |
| `errors.go` | OAuth固有エラー |

### 1.3 MySQL実装

**新規ファイル**: `dev/backend/infrastructure/mysql/oauth.go`

```go
// FindUserByGoogleId - google_idでユーザー検索
func CreateFindUserByGoogleId(q database.QueryFunc) oauth.FindUserByGoogleIdFunc

// InsertOAuthLink - OAuth連携情報を挿入
func CreateInsertOAuthLink(exec database.ExecFunc) oauth.InsertOAuthLinkFunc

// FindOAuthLinkByUserId - user_idでOAuth連携情報を取得
func CreateFindOAuthLinkByUserId(q database.QueryFunc) oauth.FindOAuthLinkByUserIdFunc
```

### 1.4 HTTPサーバー追加

**新規ファイル**: `dev/backend/server/http.go`

```go
func NewHTTPServer(port int, handler *oauth.Handler) (HTTPServe, error) {
    mux := http.NewServeMux()

    // CORS設定
    corsHandler := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:5173"},
        AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders:   []string{"Content-Type"},
        AllowCredentials: true,
    })

    mux.HandleFunc("POST /auth/google/callback", handler.Callback)
    mux.HandleFunc("POST /auth/google/link", handler.LinkAccount)

    return corsHandler.Handler(mux), nil
}
```

**修正ファイル**: `dev/backend/cmd/server.go`

- 環境変数 `HTTP_PORT` 追加
- HTTPサーバーをgoroutineで並行起動

---

## Phase 2: OAuth ロジック実装

### 2.1 Google OAuth クライアント

**ファイル**: `dev/backend/oauth/google.go`

```go
type GoogleClient struct {
    clientID     string
    clientSecret string
    redirectURI  string
    httpClient   *http.Client
}

// ExchangeCode - 認可コードをトークンに交換（PKCE対応）
func (c *GoogleClient) ExchangeCode(code, codeVerifier string) (*TokenResponse, error)

// VerifyIDToken - id_tokenを検証してクレームを取得
func (c *GoogleClient) VerifyIDToken(idToken string) (*Claims, error)
```

### 2.2 Callbackハンドラー

**ファイル**: `dev/backend/oauth/handler.go`

```go
func (h *Handler) Callback(w http.ResponseWriter, r *http.Request) {
    // 1. リクエストボディから code, code_verifier 取得
    // 2. Googleへトークン交換
    // 3. id_token検証、google_id/email取得
    // 4. FindByGoogleId でユーザー検索
    //    - 存在: 既存ユーザーでJWT発行
    //    - 不在: 新規ユーザー作成 + OAuth連携 + JWT発行
    // 5. JSONでJWT返却
}
```

### 2.3 アカウント連携ハンドラー

```go
func (h *Handler) LinkAccount(w http.ResponseWriter, r *http.Request) {
    // 1. リクエストから token (既存JWT), code, code_verifier 取得
    // 2. JWT検証してuser_id取得
    // 3. Googleへトークン交換
    // 4. 既にgoogle_idが別ユーザーに紐付いていないか確認
    // 5. user_oauth_links に挿入
    // 6. 成功レスポンス
}
```

### 2.4 Wire DI設定

**修正ファイル**: `dev/backend/initialize/wire.go`

```go
var oauthSet = wire.NewSet(
    mysql.CreateFindUserByGoogleId,
    mysql.CreateInsertOAuthLink,
    mysql.CreateFindOAuthLinkByUserId,
    oauth.NewGoogleClient,
    oauth.NewHandler,
)
```

---

## Phase 3: フロントエンド実装

### 3.1 ディレクトリ構造

```
dev/frontend/src/
├── features/
│   └── auth/
│       ├── hooks/
│       │   └── useAuth.ts          # AuthContext + useAuth
│       ├── utils/
│       │   └── pkce.ts             # PKCE関連
│       ├── api/
│       │   └── authApi.ts          # OAuth API呼び出し
│       └── constants.ts            # OAuth設定
├── pages/
│   ├── login/
│   │   ├── view.tsx                # 更新: Googleボタン追加
│   │   └── presenter.ts            # 更新: OAuth処理
│   ├── auth/
│   │   └── callback/               # 新規: OAuthコールバック
│   └── settings/
│       └── account/                # 新規: アカウント連携設定
```

### 3.2 PKCE ユーティリティ

**新規ファイル**: `dev/frontend/src/features/auth/utils/pkce.ts`

```typescript
export const generateCodeVerifier = (): string
export const generateCodeChallenge = async (verifier: string): Promise<string>
export const generateState = (): string
```

### 3.3 認証状態管理

**新規ファイル**: `dev/frontend/src/features/auth/hooks/useAuth.ts`

```typescript
interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  userId: string | null      // 端末保存用
  password: string | null    // 端末保存用
  login: (token: string) => void
  logout: () => void
  saveCredentials: (userId: string, password: string) => void
}

export const AuthProvider: React.FC
export const useAuth: () => AuthContextType
```

### 3.4 ログインページ更新

**修正ファイル**: `dev/frontend/src/pages/login/view.tsx`

- ID/パスワード入力フォーム（端末保存から自動入力）
- 「Googleでログイン」ボタン
- 端末に保存済みの場合、自動紐付け提案UI

### 3.5 コールバックページ

**新規ファイル**: `dev/frontend/src/pages/auth/callback/`

```typescript
// presenter.ts
export const useAuthCallbackPresenter = () => {
  // 1. URLからcode取得
  // 2. sessionStorageからcode_verifier取得
  // 3. バックエンドPOST /auth/google/callback
  // 4. JWT保存、ダッシュボードへ遷移
}
```

### 3.6 設定画面（アカウント連携）

**新規ファイル**: `dev/frontend/src/pages/settings/account/`

- 現在の連携状態表示
- 「Googleアカウント連携」ボタン
- 連携解除機能（将来）

### 3.7 ルーティング追加

**修正ファイル**: `dev/frontend/src/main.tsx`

```tsx
<Route path="auth/callback" element={<AuthCallbackPage />} />
<Route path="settings/account" element={<AccountSettingsPage />} />
```

---

## Phase 4: 環境設定

### 4.1 環境変数

**修正ファイル**: `.env.example`

```env
# 既存
SECRET_KEY=your_secret_key
SERVER_PORT=4444

# 新規追加
HTTP_PORT=8080
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
FRONTEND_URL=http://localhost:5173
```

### 4.2 フロントエンド環境変数

**修正ファイル**: `dev/frontend/.env` (or vite.config.ts)

```env
VITE_BACKEND_URL=http://localhost:4444
VITE_BACKEND_HTTP_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 4.3 Docker Compose更新

**修正ファイル**: `docker-compose.dev.yml`

- HTTPポート (8080) のポートマッピング追加

---

## 修正ファイル一覧

### バックエンド（新規）
- `dev/backend/oauth/models.go`
- `dev/backend/oauth/repositories.go`
- `dev/backend/oauth/google.go`
- `dev/backend/oauth/handler.go`
- `dev/backend/oauth/errors.go`
- `dev/backend/infrastructure/mysql/oauth.go`
- `dev/backend/server/http.go`

### バックエンド（修正）
- `dev/backend/docker/mysql/init/00_init.sql` - テーブル追加
- `dev/backend/cmd/server.go` - HTTPサーバー起動追加
- `dev/backend/initialize/wire.go` - OAuth DI追加
- `dev/backend/initialize/oauth_sets.go` - 新規（Wire set定義）

### フロントエンド（新規）
- `dev/frontend/src/features/auth/utils/pkce.ts`
- `dev/frontend/src/features/auth/hooks/useAuth.ts`
- `dev/frontend/src/features/auth/api/authApi.ts`
- `dev/frontend/src/features/auth/constants.ts`
- `dev/frontend/src/pages/auth/callback/index.ts`
- `dev/frontend/src/pages/auth/callback/view.tsx`
- `dev/frontend/src/pages/auth/callback/presenter.ts`
- `dev/frontend/src/pages/settings/account/index.ts`
- `dev/frontend/src/pages/settings/account/view.tsx`
- `dev/frontend/src/pages/settings/account/presenter.ts`

### フロントエンド（修正）
- `dev/frontend/src/main.tsx` - ルーティング追加
- `dev/frontend/src/pages/login/view.tsx` - GoogleボタンUI
- `dev/frontend/src/pages/login/presenter.ts` - OAuthロジック

### 設定ファイル
- `.env.example` - 環境変数追加
- `docker-compose.dev.yml` - ポート追加

---

## Google Cloud Console設定（事前準備）

1. OAuth同意画面設定
   - スコープ: `openid`, `email`, `profile`
2. OAuth 2.0 クライアントID作成
   - 種類: ウェブアプリケーション
   - 承認済みJS生成元: `http://localhost:5173`
   - リダイレクトURI: `http://localhost:5173/auth/callback`

---

## 実装順序

1. **DBスキーマ追加** - `user_oauth_links`テーブル
2. **バックエンドOAuthパッケージ** - models → repositories → mysql実装
3. **Google OAuthクライアント** - トークン交換、id_token検証
4. **HTTPサーバー + ハンドラー** - Callback, LinkAccount
5. **Wire DI設定更新**
6. **フロントエンドPKCE** - code_verifier/challenge生成
7. **AuthContext** - 認証状態管理
8. **ログインページ更新** - Googleボタン追加
9. **コールバックページ** - OAuth完了処理
10. **設定画面** - アカウント連携UI
11. **統合テスト**