# Master Data Editor

ゲームのマスタデータCSVファイルを編集するWebエディタ。

## 起動方法

### ローカル起動

```bash
cd dev/editor
yarn install
yarn dev
```

- フロントエンド: http://localhost:5174
- APIサーバー: http://localhost:3001

### Docker起動

```bash
cd dev/editor
docker compose up --build
```

### テスト実行

```bash
cd dev/editor
docker compose run --rm editor yarn test:run
```

## 機能

- **アイテム/スキル/探索/ステージ**のマスタデータ編集
- 行のダブルクリックでインライン編集
- 行選択で詳細パネル表示
- リレーション（獲得アイテム、消費アイテム、必要スキル等）の表示・編集
- サイドバーの「保存」ボタンでCSVファイルに書き込み

## 動作確認

1. `yarn dev`で起動
2. http://localhost:5174 にアクセス
3. サイドバーから「アイテム」等を選択
4. テーブルの値をダブルクリックして編集
5. 「保存」ボタンでCSVに反映

## CSVファイルの場所

`dev/backend/docker/mysql/init/data/*.csv`

Docker起動時は`/data`にマウントされる。
