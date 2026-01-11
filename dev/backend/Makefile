ifneq (,$(wildcard .env))
    include .env
    export $(shell sed -n 's/^\([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p' .env)
endif

.PHONY: db test proto dev help

# MySQL起動（レガシー互換）
db:
	cd ./docker && docker compose up -d

# テスト実行（ローカル環境）
test:
	go test -v ./...

# Protocol Bufferビルド（ルートから実行を推奨）
proto:
	@echo "⚠️  Protocol Bufferのビルドはルートディレクトリから実行することを推奨します:"
	@echo "    cd /Users/ragi/work/ringo/ringo && make proto"
	@echo ""
	@echo "このまま実行する場合は、以下のコマンドを使用します:"
	@cd ../.. && docker compose --profile tools run --rm protoc

# 開発モード起動（Docker使用を推奨）
dev:
	@echo "⚠️  Docker Compose を使った開発モードを推奨します:"
	@echo "    ルートから: make dev または make backend-only"
	@echo "    このディレクトリから: docker compose up"
	@echo ""
	@echo "ローカルで直接実行する場合は、環境変数を設定してから以下を実行:"
	@echo "    export \$$(cat .env | xargs) && go run cmd/server.go cmd/database.go"

# ヘルプ
help:
	@echo "Backend Makefile - Available targets:"
	@echo "  db    - Start MySQL container (legacy)"
	@echo "  test  - Run tests locally"
	@echo "  proto - Build Protocol Buffer (recommended to run from root)"
	@echo "  dev   - Show development mode instructions"
	@echo "  help  - Show this help message"