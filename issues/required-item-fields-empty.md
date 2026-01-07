# RequiredItem の required_count / stock が未設定

- 対象: dev/backend/core/game/explore/get_stage_action_detail_service.go
- 対象: dev/backend/core/game/explore/get_item_action_detail_service.go
- 問題: RequiredItem の required_count / stock をレスポンスで返していない
- 影響: クライアントで必要数や在庫状況が表示できない
- 対応案: RequiredItemsToGateway でフィールドを埋める、または追加取得する
