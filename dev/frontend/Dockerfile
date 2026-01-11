# ベースイメージに Node を指定
FROM node:24-alpine3.22

# 作業ディレクトリ
WORKDIR /app

# 依存関係だけ先にコピーしてキャッシュ用にする
COPY package.json yarn.lock ./

# 依存関係インストール
RUN yarn install --frozen-lockfile

# あとはソース全体をコピー
COPY . .

# Vite の dev server 用ポート
EXPOSE 5173

# 開発サーバー起動
CMD ["yarn", "dev", "--host"]
