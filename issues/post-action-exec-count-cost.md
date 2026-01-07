# PostAction が exec_count をコストに反映しない

- 対象: dev/backend/core/game/post_action_service.go
- 問題: required_payment / required_stamina が exec_count 回分ではなく1回分しか消費されない
- 影響: 実行回数を増やしてもコストが増えず、想定外の挙動になり得る
- 対応案: コストを exec_count 倍する、または仕様として明文化する
