# Docker構成統合とProtocol Bufferローカルビルド実装計画

## 概要

frontendとbackendで分離されているdocker-compose構成を統合し、Protocol Bufferのローカルビルド機能を追加します。統合版で全サービスを一括起動できるようにしつつ、各サービスを単品でも起動・開発できる柔軟性を維持します。

## 目標

1. **Protocol Bufferのローカルビルド**: 外部リポジトリ（RingoSuPBGo）への依存を削減し、`dev/backend/pb/`にGoコードを生成
2. **統合docker-compose**: ルートの`docker-compose.yml`で全サービス（frontend/backend/mysql）を一括起動
3. **単品起動の維持**: frontend/backendそれぞれを個別に起動・開発可能
4. **環境変数化**: バックエンドのハードコード値（DB接続設定等）を環境変数に置き換え
5. **テスト環境**: docker-compose.test.ymlを作成（既存dockertestと併用）

## 実装フェーズ

### フェーズ1: Protocol Buffer環境構築 ⭐最優先

**目的**: ローカルでProtocol Bufferコードを生成できるようにする

#### 新規作成ファイル

1. **`dev/protocol-buffer/Dockerfile`**
   - ベースイメージ: `golang:1.21-alpine`
   - `protoc`, `protoc-gen-go`, `protoc-gen-go-grpc`をインストール

2. **`dev/protocol-buffer/build.sh`**
   - 出力先: `/workspace/dev/backend/pb/gateway`
   - protocコマンドを実行してGoコード生成

3. **`dev/backend/pb/.gitkeep`**
   - 生成コード配置先ディレクトリのマーカー
   - **注意**: pb/ディレクトリ自体は.gitignoreで除外するため、.gitkeepも無視される

#### 修正ファイル

4. **`dev/backend/go.mod`**
   - `replace github.com/asragi/RingoSuPBGo => ./pb` を追加
   - 外部依存からローカルパスに切り替え

5. **`.gitignore`**
   - `dev/backend/pb/` を追加（**生成コードは.gitignoreで除外**）
   - `dev/backend/tmp/` を追加（Air用）
   - `.env` を追加

#### 検証方法

```bash
# 初回セットアップ（生成コードがgitignoreされているため）
make proto

# 生成ファイル確認
ls dev/backend/pb/gateway/
# 期待: schema.pb.go, schema_grpc.pb.go

# .gitignore確認
git status dev/backend/pb/
# 期待: Untracked files（gitignoreされている）

# コンパイル確認
cd dev/backend
go mod tidy
go build ./cmd/server.go ./cmd/database.go
```

---

### フェーズ2: Backend環境変数化

**目的**: ハードコードされたDB接続設定等を環境変数に置き換え

#### 修正ファイル

1. **`dev/backend/cmd/database.go`** ([現在の状態](dev/backend/cmd/database.go:10-16))
   - `getEnvOrError()` ヘルパー関数を追加（デフォルト値なし）
   - 環境変数から値を取得、未設定の場合はエラーを返す
   - 対象: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

2. **`dev/backend/cmd/server.go`** ([現在の状態](dev/backend/cmd/server.go:17,32))
   - `SECRET_KEY`, `SERVER_PORT` を環境変数化（デフォルト値なし）
   - 環境変数未設定時はエラーを返して起動を中止
   - 起動時のログメッセージを追加

#### 新規作成ファイル

3. **`dev/backend/.env.example`**
   ```env
   DB_HOST=mysql
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=ringo
   DB_NAME=ringo
   SERVER_PORT=4444
   SECRET_KEY=secret
   DOCKER_HOST=unix:///Users/YOUR_USERNAME/.docker/run/docker.sock
   ```

#### 検証方法

```bash
cd dev/backend
cp .env.example .env
# .envを編集して値を設定

# 既存のMySQL起動
make db

# 環境変数未設定でのエラー確認
unset DB_HOST
go run cmd/server.go cmd/database.go
# 期待: エラーメッセージ「環境変数 DB_HOST が設定されていません」

# .envから環境変数を読み込んで起動
export $(cat .env | xargs)
go run cmd/server.go cmd/database.go
# 期待: ポート4444でgRPCサーバー起動
```

---

### フェーズ3: BackendのDocker化

**目的**: Goアプリケーションをコンテナ化し、ホットリロードに対応

#### 新規作成ファイル

1. **`dev/backend/Dockerfile`** (本番用・マルチステージビルド)
   - ビルドステージ: 依存関係ダウンロード、Wire生成、バイナリビルド
   - 実行ステージ: Alpine最小イメージでバイナリ実行

2. **`dev/backend/Dockerfile.dev`** (開発用・ホットリロード対応)
   - `Air`と`Delve`をインストール
   - ソースコードはボリュームマウントで提供

3. **`dev/backend/.air.toml`** (Airの設定)
   - ビルドコマンド: `cd initialize && wire && cd .. && go build ...`
   - 監視対象: `*.go`, `*.tpl`, `*.tmpl`, `*.html`
   - 除外: `*_test.go`, `pb`, `docker`, `test`

4. **`dev/backend/docker-compose.yml`** (バックエンド単品起動用)
   ```yaml
   services:
     mysql:
       build: ./docker/mysql
       ports: ["13306:3306"]
       healthcheck: ...
     backend:
       build:
         context: .
         dockerfile: Dockerfile.dev
       ports: ["4444:4444", "2345:2345"]
       depends_on:
         mysql:
           condition: service_healthy
       volumes:
         - .:/app
         - go_modules:/go/pkg/mod
   ```

#### 検証方法

```bash
cd dev/backend
docker compose up --build

# 別ターミナルで確認
docker ps  # mysql + backend コンテナ起動確認
curl localhost:4444  # gRPCサーバー応答確認

# ホットリロード確認
echo "// test" >> cmd/server.go
# ログでAirの再ビルドを確認
```

---

### フェーズ4: 統合docker-compose作成

**目的**: frontend/backend/mysqlを統合管理

#### 新規作成ファイル

1. **`docker-compose.yml`** (ルート・統合版)
   ```yaml
   services:
     protoc:
       build: ./dev/protocol-buffer
       profiles: [tools]
       command: sh /workspace/dev/protocol-buffer/build.sh

     mysql:
       build: ./dev/backend/docker/mysql
       ports: ["13306:3306"]
       healthcheck: ...

     backend:
       build:
         context: ./dev/backend
         dockerfile: Dockerfile
       ports: ["4444:4444"]
       depends_on:
         mysql:
           condition: service_healthy
       environment:
         - DB_HOST=mysql
         - DB_PORT=3306

     frontend:
       build: ./dev/frontend
       ports: ["5173:5173"]
       environment:
         - VITE_BACKEND_URL=http://localhost:4444
   ```

2. **`docker-compose.dev.yml`** (開発用オーバーライド)
   - backendに`Dockerfile.dev`を指定
   - ホットリロード用のボリュームマウント
   - デバッガーポート2345を公開

3. **`docker-compose.test.yml`** (テスト用オーバーライド)
   - MySQLをtmpfs（インメモリ）化
   - backendのcommandをテスト実行に変更
   - カバレッジレポート出力

4. **`.env.example`** (ルート)
   ```env
   DB_USER=root
   DB_PASSWORD=ringo
   DB_NAME=ringo
   DB_PORT=13306
   BACKEND_PORT=4444
   FRONTEND_PORT=5173
   SECRET_KEY=secret
   VITE_BACKEND_URL=http://localhost:4444
   ```

5. **`Makefile`** (ルート)
   ```makefile
   proto:         docker compose --profile tools run protoc
   up:            docker compose up -d
   dev:           docker compose -f docker-compose.yml -f docker-compose.dev.yml up
   backend-only:  cd dev/backend && docker compose up
   frontend-only: cd dev/frontend && docker compose up
   test:          docker compose -f docker-compose.yml -f docker-compose.test.yml up --abort-on-container-exit
   down:          docker compose down
   clean:         docker compose down -v
   ```

#### 検証方法

```bash
cd /Users/ragi/work/ringo/ringo

# 統合起動
make up
docker ps  # mysql, backend, frontend 3つ起動確認

# 開発モード起動
make dev
# ファイル編集でホットリロード確認

# Protocol Bufferビルド
make proto
ls dev/backend/pb/gateway/

# テスト実行
make test
```

---

### フェーズ5: Frontend環境変数追加

**目的**: フロントエンドからバックエンドへの接続設定

#### 修正ファイル

1. **`dev/frontend/docker-compose.yml`**
   - `environment` に `VITE_BACKEND_URL=${VITE_BACKEND_URL:-http://localhost:4444}` を追加

#### 検証方法

```bash
cd dev/frontend
docker compose up

# コンテナ内で環境変数確認
docker compose exec frontend env | grep VITE_BACKEND_URL
```

---

### フェーズ6: Makefile更新

**目的**: 既存のdev/backend/Makefileを新フローに対応

#### 修正ファイル

1. **`dev/backend/Makefile`**
   - `proto` ターゲット追加（ルートから実行を推奨するメッセージ）
   - `dev` ターゲット追加（Docker使用を推奨するメッセージ）
   - 既存の`db`, `test`は維持

---

## 重要な実装ポイント

### 1. Protocol Bufferの生成コードは.gitignoreで除外

- `dev/backend/pb/` 配下のコードは**.gitignoreに含める**
- 理由: 初回セットアップ時やCI環境で必ずビルドを実行させる
- CI環境でもビルドを実行し、生成コードの検証を行う
- `.gitignore`に`dev/backend/pb/`を必ず追加

### 2. go.modのreplaceディレクティブ

```go
replace github.com/asragi/RingoSuPBGo => ./pb
```

- 相対パス`./pb`を使用
- pb/ディレクトリが存在しない場合は `make proto` を実行
- Protocol Bufferビルド後に`go mod tidy`を実行
- CI環境でも同様の手順が必要

### 3. 環境変数は必須（デフォルト値なし）

環境変数が設定されていない場合はエラーを返します：

```go
func getEnvOrError(key string) (string, error) {
    value := os.Getenv(key)
    if value == "" {
        return "", fmt.Errorf("環境変数 %s が設定されていません", key)
    }
    return value, nil
}
```

- `.env`ファイルまたは環境変数の設定が必須
- 設定漏れを防ぎ、明示的な設定を強制

### 4. ホットリロード対応

- **Backend**: Air使用、`.air.toml`で設定
- **Frontend**: Vite標準機能、`CHOKIDAR_USEPOLLING=true`必須

### 5. 単品起動と統合起動の両立

- **統合起動**: ルートの`docker-compose.yml`で全サービス
- **単品起動**: `dev/frontend/docker-compose.yml`, `dev/backend/docker-compose.yml`
- ネットワーク名を分離して競合を回避
  - 統合版: `ringo_network`
  - バックエンド単品: `backend_network`

### 6. Google Wireの扱い

Wire生成は以下のタイミングで実行：

- Dockerビルド時（本番用Dockerfile内）
- Airの再ビルド時（.air.tomlのbuildコマンド内）
- 手動実行: `cd dev/backend/initialize && wire`

### 7. テスト環境の併用

- **docker-compose.test.yml**: CI/CD用、再現性重視
- **既存dockertest**: ローカル開発用、高速
- 両方とも維持し、用途に応じて使い分け

---

## 実装ファイル一覧

### 新規作成（13ファイル）

| ファイルパス | 説明 |
|------------|------|
| `dev/protocol-buffer/Dockerfile` | protoc実行環境 |
| `dev/protocol-buffer/build.sh` | PBビルドスクリプト |
| `dev/backend/pb/.gitkeep` | 生成コード配置先 |
| `dev/backend/Dockerfile` | Backend本番用 |
| `dev/backend/Dockerfile.dev` | Backend開発用 |
| `dev/backend/.air.toml` | Air設定 |
| `dev/backend/docker-compose.yml` | Backend単品起動 |
| `dev/backend/.env.example` | Backend環境変数例 |
| `docker-compose.yml` | 統合版メイン |
| `docker-compose.dev.yml` | 開発用オーバーライド |
| `docker-compose.test.yml` | テスト用オーバーライド |
| `.env.example` | ルート環境変数例 |
| `Makefile` | 統合タスクランナー |

### 修正（6ファイル）

| ファイルパス | 変更内容 |
|------------|---------|
| `dev/backend/cmd/database.go` | 環境変数化（getEnvOrError追加） |
| `dev/backend/cmd/server.go` | SECRET_KEY, SERVER_PORT環境変数化（エラー処理追加） |
| `dev/backend/go.mod` | replaceディレクティブ追加 |
| `dev/frontend/docker-compose.yml` | VITE_BACKEND_URL追加 |
| `.gitignore` | pb/, tmp/, .env追加 |
| `dev/backend/Makefile` | proto, devターゲット追加 |

---

## 開発フローの変化

### 従来のフロー

```bash
# バックエンド開発
cd dev/backend
make db
go run cmd/server.go

# フロントエンド開発
cd dev/frontend
docker compose up

# Protocol Buffer更新
1. schema.proto編集
2. GitHubにPR
3. マージ後、外部リポジトリでビルド
4. go getで取得
```

### 新しいフロー

```bash
# 初回セットアップ
cd /Users/ragi/work/ringo/ringo
cp .env.example .env
# .envを編集して環境変数を設定（必須）

# Protocol Bufferコード生成（初回必須）
make proto

# 統合開発（推奨）
make dev

# バックエンド単品
make backend-only

# フロントエンド単品
make frontend-only

# Protocol Buffer更新
vim dev/protocol-buffer/gateway/schema.proto
make proto
git add dev/protocol-buffer/gateway/schema.proto
git commit -m "Update protobuf schema"
# 注意: dev/backend/pb/ は.gitignoreされているのでコミット不要
```

---

## 移行時の注意事項

1. **段階的移行を推奨**
   - フェーズ1から順に実装
   - 各フェーズで動作確認してから次へ

2. **既存ワークフローの維持**
   - `cd dev/backend && make db && go run cmd/...` も引き続き動作
   - 既存の開発者は移行タイミングを選択可能

3. **Protocol Bufferの生成コード**
   - dev/backend/pb/ は.gitignoreで除外
   - 初回セットアップ時は必ず `make proto` を実行
   - CI環境でもビルドを実行し、生成コードの検証を行う
   - 外部リポジトリ（RingoSuPBGo）への依存は完全に削除

4. **Docker環境のリソース**
   - 初回ビルドは3-5分程度
   - 2回目以降はキャッシュで高速化

5. **CI環境での対応**
   - CI環境でも `make proto` を実行してProtocol Bufferコードを生成
   - 生成コードの検証をCIパイプラインに組み込む
   - 環境変数は必須のため、CI環境でも設定が必要

6. **Mac固有の設定**
   - `.env`の`DOCKER_HOST`はユーザー名に応じて調整が必要
   - dockertest使用時に必要

---

## トラブルシューティング

### Protocol Bufferコンパイルエラー

初回セットアップやclone後は必ず実行：

```bash
make proto
cd dev/backend
go mod tidy
go build ./cmd/...
```

CI環境でも同様にビルドを実行する必要があります。

### ポート競合

統合起動と単品起動を同時に実行しない：

```bash
make down  # 全て停止
make dev   # または make backend-only
```

### ホットリロードが動作しない

- Frontend: `CHOKIDAR_USEPOLLING=true`が設定されているか確認
- Backend: `.air.toml`が正しく配置されているか確認
- ボリュームマウントが正しいか確認

---

## 主要ファイルパス（実装時参照用）

- [dev/backend/cmd/database.go](dev/backend/cmd/database.go:10-16) - DB接続設定（環境変数化対象）
- [dev/backend/cmd/server.go](dev/backend/cmd/server.go:17,32) - サーバー起動（SECRET_KEY, PORT環境変数化対象）
- [dev/backend/go.mod](dev/backend/go.mod:6) - RingoSuPBGo依存（replaceディレクティブ追加対象）
- [dev/backend/initialize/wire.go](dev/backend/initialize/wire.go) - Wire定義（ビルド時に生成が必要）
- [dev/protocol-buffer/gateway/schema.proto](dev/protocol-buffer/gateway/schema.proto) - PB定義ファイル
