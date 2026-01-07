# UpdateShelfSize のバリデーション引数順

- 対象: dev/backend/core/game/shelf/update_shelf_size.go
- 問題: ValidateUpdateShelfSize の引数が (currentSize, targetSize) の順で渡されているが、定義は (targetSize, currentSize)
- 影響: 範囲チェックが実質無効になり、不正な target size が通る可能性
- 対応案: 引数順を修正、または関数シグネチャと呼び出しを統一する
