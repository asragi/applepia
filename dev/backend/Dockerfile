# ビルドステージ
FROM golang:1.22-alpine AS builder

WORKDIR /app

# 必要なパッケージをインストール
RUN apk add --no-cache git

# 依存関係ファイルをコピー
COPY go.mod go.sum ./
COPY pb/ ./pb/
RUN go mod download

# ソースコードをコピー
COPY . .

# Wire生成
RUN cd initialize && go install github.com/google/wire/cmd/wire@v0.6.0 && wire

# バイナリをビルド
RUN CGO_ENABLED=0 GOOS=linux go build -o /ringo-server ./cmd/server.go ./cmd/database.go

# 実行ステージ
FROM alpine:latest

WORKDIR /root/

# タイムゾーン設定用パッケージをインストール
RUN apk --no-cache add ca-certificates tzdata

# ビルドしたバイナリをコピー
COPY --from=builder /ringo-server .

# ポート公開
EXPOSE 4444

# 実行
CMD ["./ringo-server"]
