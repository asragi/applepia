# API仕様 (gRPC)

## 概要

- 通信プロトコル: gRPC (proto3)
- パッケージ: `ringosu`
- スキーマ: `dev/protocol-buffer/gateway/schema.proto`
- 時刻: `google.protobuf.Timestamp`

## 認証

- `SignUp`で`user_id`と`row_password`を取得
- `Login`で`access_token`を取得
- 以降のリクエストは、各メッセージ内の`token`または`access_token`を使用
- Admin系APIは`AdminLogin`で取得したトークンを使用

トークン形式は`header.payload.signature`（JWT風の独自形式）で、`ValidateToken`で検証されます。

## エラーハンドリング

- 明示的な`status.Errorf`を使っているのは`PostAction`のみ
- それ以外のエラーはgRPCにより`Unknown`として返る（Goのデフォルト動作）

### 代表的なステータス

- `PostAction`
  - `Unauthenticated`: トークン不正
  - `Internal`: その他の失敗
- その他のAPI
  - `Unknown`: 例外・バリデーション失敗・権限不足など
- `GetShops`
  - `Unimplemented`: サーバ側未実装

## リトライポリシー（推奨）

- `Get*`系: 冪等のため短いバックオフでリトライ可
- `SignUp`, `Login`, `PostAction`, `Update*`, `ChangePeriod`, `ChangeTime`, `InvokeAutoApplyReservation`: 状態変更のため自動リトライは非推奨

## 共通フィールド

- `token`: `Login`で得た`access_token`
- `access_token`: `GetItemActionDetail`のみ別名フィールド
- `index`: 棚の0始まりインデックス

---

## 共通メッセージ

```proto
message RequiredItem {
  string item_id = 1;
  int32 required_count = 2;
  int32 stock = 3;
  bool is_known = 4;
}

message EarningItem {
  string item_id = 1;
  bool is_known = 2;
}

message RequiredSkill {
  string skill_id = 1;
  string display_name = 2;
  int32 skill_lv = 3;
  int32 required_lv = 4;
}

message EarnedItems {
  string item_id = 10;
  int32 count = 1;
}

message ConsumedItems {
  string item_id = 10;
  int32 count = 1;
}

message SkillGrowthResult {
  string skill_id = 10;
  int32 before_exp = 1;
  int32 before_lv = 2;
  int32 after_exp = 3;
  int32 after_lv = 4;
  string display_name = 5;
}

message Reservation {
  string reservation_id = 1;
  string user_id = 2;
  int32 index = 3;
  int32 purchase_num = 4;
  google.protobuf.Timestamp scheduled_time = 5;
}
```

---

## 認証API

### SignUp

ユーザー登録。初期ユーザーと棚を生成し、ログイン用情報を返す。

**Request**

```proto
message SignUpRequest {}
```

**Response**

```proto
message SignUpResponse {
  string user_id = 1;
  string row_password = 2;
}
```

**エラー**

- `Unknown`: 登録失敗

---

### Login

ユーザーIDとパスワードでログインし、アクセストークンを返す。

**Request**

```proto
message LoginRequest {
  string user_id = 1;
  string row_password = 2;
}
```

**Response**

```proto
message LoginResponse {
  string access_token = 2;
}
```

**バリデーション**

- `user_id`, `row_password`は空文字不可

**エラー**

- `Unknown`: 認証失敗

---

## リソースAPI

### GetResource

ユーザーの基礎リソース（資金・スタミナ）を取得。

**Request**

```proto
message GetResourceRequest {
  string token = 2;
}
```

**Response**

```proto
message GetResourceResponse {
  string user_id = 1;
  int32 max_stamina = 2;
  int32 fund = 3;
  google.protobuf.Timestamp recover_time = 4;
}
```

**エラー**

- `Unknown`: 認証失敗、取得失敗

---

### UpdateUserName

ユーザー名を更新。

**Request**

```proto
message UpdateUserNameRequest {
  string token = 1;
  string user_name = 2;
}
```

**Response**

```proto
message UpdateUserNameResponse {
  string user_name = 2;
}
```

**バリデーション**

- 1〜10文字

**エラー**

- `Unknown`: 認証失敗・バリデーション失敗

---

### UpdateShopName

店舗名を更新。

**Request**

```proto
message UpdateShopNameRequest {
  string token = 1;
  string shop_name = 2;
}
```

**Response**

```proto
message UpdateShopNameResponse {
  string shop_name = 2;
}
```

**バリデーション**

- 1〜10文字

**エラー**

- `Unknown`: 認証失敗・バリデーション失敗

---

## 探索API

### GetStageList

ステージ一覧と探索候補を取得。

**Request**

```proto
message GetStageListRequest {
  string token = 2;
}
```

**Response**

```proto
message GetStageListResponse {
  repeated StageInformation stage_information = 1;
}

message StageInformation {
  string stage_id = 1;
  string display_name = 2;
  bool is_known = 3;
  string description = 4;
  repeated UserExplore user_explore = 5;
}

message UserExplore {
  string explore_id = 1;
  string display_name = 2;
  bool is_known = 3;
  bool is_possible = 4;
}
```

**処理概要**

- `is_possible`は現在のリソースで探索可能かを判定

**エラー**

- `Unknown`: 認証失敗・取得失敗

---

### GetStageActionDetail

ステージ内アクション（探索）の詳細を取得。

**Request**

```proto
message GetStageActionDetailRequest {
  string stage_id = 2;
  string token = 3;
  string explore_id = 4;
}
```

**Response**

```proto
message GetStageActionDetailResponse {
  string user_id = 1;
  string stage_id = 2;
  string display_name = 3;
  string action_display_name = 4;
  int32 required_payment = 5;
  int32 required_stamina = 6;
  repeated RequiredItem required_items = 7;
  repeated EarningItem earning_items = 8;
  repeated RequiredSkill required_skills = 9;
}
```

**備考**

- 実装上、`RequiredItem.required_count` と `RequiredItem.stock` は未設定（0）

**エラー**

- `Unknown`: 認証失敗・取得失敗

---

### PostAction

探索アクションの実行。

**Request**

```proto
message PostActionRequest {
  string token = 2;
  string explore_id = 3;
  int32 exec_count = 4;
}
```

**Response**

```proto
message PostActionResponse {
  repeated EarnedItems earned_items = 2;
  repeated ConsumedItems consumed_items = 3;
  repeated SkillGrowthResult skill_growth_result = 4;
}
```

**処理概要**

- 獲得/消費アイテムとスキル成長結果を返却
- 資金は`required_payment`を1回のみ消費
- スタミナは`required_stamina`を1回のみ消費

**エラー**

- `Unauthenticated`: トークン不正
- `Internal`: 実行失敗

---

### GetItemList

アイテム一覧を取得。

**Request**

```proto
message GetItemListRequest {
  string token = 2;
}
```

**Response**

```proto
message GetItemListResponse {
  repeated GetItemListResponseRow item_list = 1;
}

message GetItemListResponseRow {
  string item_id = 1;
  string display_name = 2;
  int32 price = 3;
  int32 stock = 4;
  int32 max_stock = 5;
}
```

**エラー**

- `Unknown`: 認証失敗・取得失敗

---

### GetItemDetail

アイテム詳細と関連探索を取得。

**Request**

```proto
message GetItemDetailRequest {
  string item_id = 2;
  string token = 3;
}
```

**Response**

```proto
message GetItemDetailResponse {
  string user_id = 1;
  string item_id = 2;
  int32 price = 3;
  string display_name = 4;
  string description = 5;
  int32 max_stock = 6;
  int32 stock = 7;
  repeated UserExplore user_explore = 8;
}
```

**備考**

- 実装上、`display_name` と `description` は未設定（空文字）

**エラー**

- `Unknown`: 認証失敗・取得失敗

---

### GetItemActionDetail

アイテム由来の探索アクション詳細を取得。

**Request**

```proto
message GetItemActionDetailRequest {
  string item_id = 2;
  string explore_id = 3;
  string access_token = 4;
}
```

**Response**

```proto
message GetItemActionDetailResponse {
  string user_id = 1;
  string item_id = 2;
  string display_name = 3;
  string action_display_name = 4;
  int32 required_payment = 5;
  int32 required_stamina = 6;
  repeated RequiredItem required_items = 7;
  repeated EarningItem earning_items = 8;
  repeated RequiredSkill required_skills = 9;
}
```

**備考**

- `access_token`フィールド名に注意
- 実装上、`RequiredItem.required_count` と `RequiredItem.stock` は未設定（0）

**エラー**

- `Unknown`: 認証失敗・取得失敗

---

## 棚API

### GetMyShelf

自分の棚一覧を取得。予約を適用してから結果を返す。

**Request**

```proto
message GetMyShelfRequest {
  string token = 1;
}
```

**Response**

```proto
message GetMyShelfResponse {
  repeated Shelf shelves = 1;
}

message Shelf {
  int32 index = 1;
  int32 set_price = 2;
  string item_id = 3;
  string display_name = 4;
  int32 stock = 5;
  int32 max_stock = 6;
  string user_id = 7;
  string shelf_id = 8;
}
```

**備考**

- 実装上、`max_stock`は未設定（0）

**エラー**

- `Unknown`: 認証失敗・取得失敗

---

### UpdateShelfContent

棚の内容（アイテムと価格）を更新し、予約を生成。

**Request**

```proto
message UpdateShelfContentRequest {
  string token = 1;
  int32 index = 2;
  int32 set_price = 3;
  string item_id = 4;
}
```

**Response**

```proto
message UpdateShelfContentResponse {
  int32 index = 2;
  int32 set_price = 3;
  string item_id = 4;
  repeated Reservation reservations = 5;
}
```

**バリデーション**

- indexが存在する
- 同じアイテムが他の棚にない
- 対象アイテム在庫が1以上

**エラー**

- `Unknown`: 認証失敗・バリデーション失敗

---

### UpdateShelfSize

棚サイズを変更。

**Request**

```proto
message UpdateShelfSizeRequest {
  string token = 1;
  int32 size = 2;
}
```

**Response**

```proto
message UpdateShelfSizeResponse {
  int32 size = 2;
}
```

**バリデーション**

- 実装上、target sizeの範囲チェックは行われないためクライアント側で0〜8を制限する
- 変更前と同じサイズは不可

**エラー**

- `Unknown`: 認証失敗・バリデーション失敗・アクション実行失敗

---

## ランキングAPI

### GetDailyRanking

ランキング一覧を取得。予約を全ユーザーに適用してから集計。

**Request**

```proto
message GetDailyRankingRequest {
  int32 limit = 1;
  int32 offset = 2;
}
```

**Response**

```proto
message GetDailyRankingResponse {
  repeated RankingRow ranking = 1;
}

message RankingRow {
  string user_id = 1;
  string user_name = 2;
  int32 rank = 3;
  int32 total_score = 4;
  repeated Shelf shelves = 5;
}
```

**備考**

- ランキング棚の`max_stock`は`-1`で固定
- 認証は不要。GET時に予約適用とランキング更新が走る設計（負荷分散のため）

**エラー**

- `Unknown`: 取得失敗

---

## 管理者API

### AdminLogin

管理者ログイン。

**Request**

```proto
message AdminLoginRequest {
  string user_id = 1;
  string row_password = 2;
}
```

**Response**

```proto
message AdminLoginResponse {
  string token = 1;
}
```

**エラー**

- `Unknown`: 認証失敗

---

### ChangePeriod

ランキング期間を進める。

**Request**

```proto
message ChangePeriodRequest {
  string token = 1;
}
```

**Response**

```proto
message ChangePeriodResponse {}
```

**エラー**

- `Unknown`: 認証失敗・管理者権限なし

---

### ChangeTime

サーバ時刻を任意の時刻に変更（デバッグ用途）。

**Request**

```proto
message ChangeTimeRequest {
  string token = 1;
  google.protobuf.Timestamp time = 2;
}
```

**Response**

```proto
message ChangeTimeResponse {}
```

**エラー**

- `Unknown`: 認証失敗・管理者権限なし

---

### InvokeAutoApplyReservation

予約を自動挿入（バッチ）。

**Request**

```proto
message InvokeAutoApplyReservationRequest {
  string token = 1;
}
```

**Response**

```proto
message InvokeAutoApplyReservationResponse {}
```

**エラー**

- `Unknown`: 認証失敗・管理者権限なし

---

## 未実装API

### GetShops

proto定義は存在するがサーバ側未実装。

**Request**

```proto
message GetShopsRequest {
  string token = 1;
  int32 page = 2;
  int32 limit = 3;
}
```

**Response**

```proto
message GetShopsResponse {
  repeated Shop shop = 1;
}

message Shop {
  string user_id = 1;
  string user_name = 2;
  int32 rank = 3;
  repeated Shelf shelves = 4;
}
```
