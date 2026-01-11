# Global Rules

- 日本語で回答

# Project Structure

- frontend/
  - 詳細は frontend/CLAUDE.md
  - ゲームサーバに対して単なるクライアントであり，ゲームの仕様やゲームのデータをキャッシュ用途以外で保持しない．
- backend/
  - ゲームサーバであり機能の全てを提供する
- editor/
  - 詳細は dev/editor/CLAUDE.md

# Environment

Claude Code Web では GITHUB_TOKEN を与えているのでPRやissueの作成時はこれを使って
