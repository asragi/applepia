.PHONY: up install down

build:
	docker compose build

install:
	docker compose run --rm frontend yarn install

down:
	docker compose down

up:
	docker compose up

format:
	docker compose run --rm frontend yarn exec biome check -- --write .

assert:
	docker compose run --rm frontend yarn exec biome check -- --write .
	docker compose run --rm frontend yarn run lint
	docker compose run --rm frontend yarn run build
