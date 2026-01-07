# Reservation の purchase_num が固定値

- 対象: dev/backend/core/game/shelf/reservation/models.go
- 問題: createReservations が PurchaseNum = 1 で固定（TODO のまま）
- 影響: 購入数が商品や確率に基づかず固定になる
- 対応案: 購入数の計算ロジックを実装、または仕様として明記
