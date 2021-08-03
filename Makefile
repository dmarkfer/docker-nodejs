PORT ?= 8888

env:
	@echo PORT=$(PORT)> .env

build: env
	docker-compose build

up: env
	docker-compose up -d

down:
	docker-compose down
