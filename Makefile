# 環境変数ファイルがあれば読み込む
ifneq (,$(wildcard .env))
    include .env
    export $(shell sed -n 's/^\([A-Za-z_][A-Za-z0-9_]*\)=.*/\1/p' .env)
endif

.PHONY: proto up dev backend-only frontend-only test down clean logs help

# Protocol Bufferコード生成
proto:
	@echo "Building Protocol Buffer files..."
	docker compose --profile tools run --rm protoc

# 統合起動（本番用イメージ）
up:
	@echo "Starting all services (production mode)..."
	docker compose up -d

# 開発モード起動（ホットリロード有効）
dev:
	@echo "Starting all services (development mode with hot reload)..."
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Backend単品起動
backend-only:
	@echo "Starting backend service only..."
	cd dev/backend && docker compose up

# Frontend単品起動
frontend-only:
	@echo "Starting frontend service only..."
	cd dev/frontend && docker compose up

# テスト実行
test:
	@echo "Running tests..."
	docker compose -f docker-compose.yml -f docker-compose.test.yml up --abort-on-container-exit

# 全サービス停止
down:
	@echo "Stopping all services..."
	docker compose down

# 全サービス停止とボリューム削除
clean:
	@echo "Stopping all services and removing volumes..."
	docker compose down -v

# ログ表示
logs:
	docker compose logs -f

# ヘルプ
help:
	@echo "Available targets:"
	@echo "  proto          - Build Protocol Buffer files"
	@echo "  up             - Start all services (production mode)"
	@echo "  dev            - Start all services (development mode with hot reload)"
	@echo "  backend-only   - Start backend service only"
	@echo "  frontend-only  - Start frontend service only"
	@echo "  test           - Run tests"
	@echo "  down           - Stop all services"
	@echo "  clean          - Stop all services and remove volumes"
	@echo "  logs           - Show logs"
	@echo "  help           - Show this help message"
