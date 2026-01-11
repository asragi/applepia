# Ringo Backend 実装ガイド

## ゲーム概要

店舗経営シミュレーション。探索→収集→陳列→販売のサイクルでスコアを競う。

- **探索**: スタミナ・資金消費でアイテム収集、スキル成長
- **棚**: 最大8個、価格設定可能
- **予約**: 時間経過で自動来店・購入（人気度・価格に依存）
- **ランキング**: 期間ごとにスコア集計

## アーキテクチャ

### レイヤー構造

```
endpoint/       → プレゼンテーション（gRPC）
core/          → ドメイン（ビジネスロジック）
infrastructure/ → インフラ（MySQL実装）
database/      → データベース抽象化
```

**依存ルール**: 外→内のみ。内側は外側を知らない（インターフェース経由）。

### DI（Google Wire）

`initialize/wire.go`で依存定義、`wire_gen.go`が自動生成。コンパイル時に解決。

## 設計原則

### 1. 型安全性

```go
type UserId string
type ItemId string
type Fund int
```

プリミティブ型をラップして誤代入を防止。

### 2. Repository パターン

```go
// core/game/repositories.go
type CoreRepository interface {
    GetUserResource(ctx, userId) (UserResource, error)
}

// infrastructure/mysql/core.go
type coreRepository struct { db DBAccessor }
```

ビジネスロジックとDB分離。テスト時はインメモリ実装に切替。

### 3. 高階関数

```go
func CreateService(repo Repository) func(ctx, input) (result, error) {
    return func(ctx, input) (result, error) {
        // ビジネスロジック
    }
}
```

依存を明示、部分適用可能。

### 4. エラーハンドリング

```go
handleError := func(err error) (Result, error) {
    return Result{}, fmt.Errorf("funcName: %w", err)
}
```

全関数でエラー返却、ラップで文脈追加。

### 5. トランザクション

```go
db.Transaction(ctx, func(txCtx context.Context) error {
    updateA(txCtx, dataA)
    updateB(txCtx, dataB)
    return nil
})
```

Context経由で伝播。

## ディレクトリ構成

```
backend/
├── core/           # ドメイン層（外部依存なし）
│   ├── models.go
│   ├── game/       # ゲームロジック
│   │   ├── repositories.go
│   │   ├── *_service.go
│   │   ├── calc_*.go
│   │   └── shelf/
│   └── auth/
├── endpoint/       # gRPC境界
├── infrastructure/ # DB境界
│   ├── mysql/
│   └── in_memory/  # テスト用
├── database/       # DB抽象化
├── initialize/     # DI設定
└── scenario/       # E2Eテスト
```

## 実装パターン

### サービス

```go
func CreateAction(repo Repo) func(ctx, input) (result, error) {
    return func(ctx, input) (result, error) {
        handleError := func(err error) (result, error) {
            return result{}, fmt.Errorf("CreateAction: %w", err)
        }

        // データ取得
        data, err := repo.Get(ctx, id)
        if err != nil { return handleError(err) }

        // 計算（純粋関数）
        result := CalcSomething(data)

        // DB更新
        if err := repo.Update(ctx, result); err != nil {
            return handleError(err)
        }

        return result, nil
    }
}
```

### リポジトリ

```go
// 取得
func (r *repo) Get(ctx, id) (Data, error) {
    query := CreateGetQuery[Data]("table", cols, "id = :id")
    return query(ctx, r.db, map[string]interface{}{"id": id})
}

// 更新
func (r *repo) Update(ctx, data) error {
    exec := CreateExec("UPDATE table SET col = :col WHERE id = :id")
    return exec(ctx, r.db, map[string]interface{}{...})
}
```

### エンドポイント

```go
type Endpoint struct {
    validateToken func(string) (UserId, error)
    service       func(context.Context, Input) (Result, error)
}

func (e *Endpoint) Handle(ctx, req) (*Response, error) {
    userId, err := e.validateToken(req.Token)
    if err != nil { return nil, status.Errorf(codes.Unauthenticated, ...) }

    result, err := e.service(ctx, input)
    if err != nil { return nil, status.Errorf(codes.Internal, ...) }

    return convertToProto(result), nil
}
```

### 計算ロジック

```go
// 純粋関数（副作用なし）
func CalcSomething(input Input) Result {
    // 計算処理
    return Result{...}
}
```

## データフロー

```
Client (gRPC)
  ↓ token, params
Endpoint (認証・変換)
  ↓ userId, domain params
Service (データ取得→計算→更新)
  ↓ Repository呼び出し
Infrastructure (SQL実行)
  ↓
Response
```

## テスト戦略

- **ユニット**: 純粋関数（計算ロジック）
- **統合**: サービス＋インメモリRepo
- **E2E**: 実DB＋シナリオ

## 実装ルール

### DO

- プリミティブ型をラップ
- 計算ロジックは純粋関数
- エラーをラップ（`%w`）
- トランザクション使用
- インターフェースで抽象化

### DON'T

- `core/`から`infrastructure/`をインポート
- グローバル変数
- 複雑な継承
- 過度な抽象化（YAGNI）
- SQLをビジネスロジックに混在

## 核心

- **レイヤー分離**: 責務明確化
- **インターフェース**: 抽象化・疎結合
- **純粋関数**: テスタブル・再利用可能
- **型安全性**: コンパイル時エラー検出
- **DI**: 依存明示・テスト容易
