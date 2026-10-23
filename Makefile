APP_DIR := apps/desktop
TAURI_DIR := apps/desktop/src-tauri

.DEFAULT_GOAL := help
.PHONY: install tauri-dev tauri-android-dev tauri-build tauri-android-build build lint fmt clippy check add help

help: ## show available targets
	@grep -E '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*## "}{printf "  %-22s %s\n", $$1, $$2}'

install: ## bun install (apps/desktop)
	cd $(APP_DIR) && bun install

tauri-dev: ## bun run tauri dev (desktop dev loop)
	cd $(APP_DIR) && bun run tauri dev

tauri-android-dev: ## bun run tauri android dev (android dev loop)
	cd $(APP_DIR) && bun run tauri android dev

tauri-build: ## bun run tauri build (export TAURI_SIGNING_PRIVATE_KEY + PASSWORD first, updater signing needs them)
	cd $(APP_DIR) && bun run tauri build

tauri-android-build: ## bun run tauri android build
	cd $(APP_DIR) && bun run tauri android build

build: ## bun run build (tsc + vite build, frontend only)
	cd $(APP_DIR) && bun run build

lint: ## bun run lint (tsc --noEmit, frontend only)
	cd $(APP_DIR) && bun run lint

fmt: ## cargo fmt (src-tauri)
	cd $(TAURI_DIR) && cargo fmt

clippy: ## cargo clippy (src-tauri)
	cd $(TAURI_DIR) && cargo clippy

check: ## cargo check (src-tauri)
	cd $(TAURI_DIR) && cargo check

add: ## bun add <deps> in apps/desktop, e.g. make add ARGS="clsx tailwind-merge"
	cd $(APP_DIR) && bun add $(ARGS)
