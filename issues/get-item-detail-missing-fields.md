# GetItemDetail の display_name / description が未設定

- 対象: dev/backend/endpoint/get_item_detail.go
- 問題: サービスで取得している DisplayName / Description をレスポンスに詰めていない
- 影響: クライアントがアイテム表示に必要な情報を取得できない
- 対応案: gateway レスポンスに display_name / description を設定する
