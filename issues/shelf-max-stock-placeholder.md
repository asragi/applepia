# Shelf の max_stock がプレースホルダ値

- 対象: dev/backend/endpoint/get_my_shelves.go
- 対象: dev/backend/endpoint/get_ranking_user_list.go
- 問題: GetMyShelf では max_stock が常に 0、GetDailyRanking では -1 固定
- 影響: クライアント側で特別な扱いが必要になる
- 対応案: item master から値を取得して統一、または proto から削除
