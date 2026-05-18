PORT ?= 3000

help:
	@echo "Targets:"
	@echo "  make install  - install npm dependencies"
	@echo "  make start    - start the Documai server"
	@echo "  make run      - alias for start"
	@echo "  make check    - syntax-check server.js"
	@echo "  make stop     - stop the server listening on PORT (default 3000)"
	@echo "  make clean    - remove node_modules"

install:
	npm install

start:
	npm start

run: start

check:
	node --check server.js

clean:
	rm -rf node_modules

stop:
	@echo "Stopping process listening on port $(PORT)..."
	-lsof -ti tcp:$(PORT) | xargs kill -9 || true
	@echo "Stopped."

.PHONY: help install start run check clean stop
