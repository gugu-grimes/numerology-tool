# Local Environment

> Mode: local
> Container manifest: `docs/TDD/0.common/docker-compose.yml`

## Services

> Repo → compose service mapping. Used by `/opera:userstory-dev` Step 6 (reload)
> and `/opera:userstory-test` Phase 0 (mount-path validation).

| Code Repo | Compose Service | Hot-reload | Reload Notes |
|-----------|-----------------|------------|--------------|
| code/frontend/ | frontend | yes (Vite HMR via bind-mount) | — |
| code/backend/ | backend | no (restart required) | — |

`Reload Notes` 列：留空 → 走默认 `up -d --build`；`image-only (use --pull)` → 走 `pull + up -d`（详见 `## Notes` 段最后一条）。

## Bring up

> Lifecycle: first start. Run from project root.

```bash
docker compose -f docs/TDD/0.common/docker-compose.yml up -d
```

## Reload

> Lifecycle: code merged, container already running. `<service>` is resolved per
> touched repo via the `## Services` table above.
>
> **Uses `up -d --build` (NOT `restart`)** — idempotent: skips when image cache is
> up-to-date (source-only change with hot-reload picks itself up; rebuild adds
> ~1-3 s of cache check); rebuilds when Dockerfile or dependency manifest
> (`package.json` / `requirements.txt` / `go.mod` / etc.) changed. This catches
> dependency drift that a bare `restart` silently misses.

```bash
docker compose -f docs/TDD/0.common/docker-compose.yml up -d --build <service>
```

## Reset data only

> Lifecycle: wipe DB + re-seed without full tear-down.

```bash
docker compose -f docs/TDD/0.common/docker-compose.yml exec backend npx prisma db seed
```

## Tear down

> Lifecycle: end of iteration / PR submit.

```bash
docker compose -f docs/TDD/0.common/docker-compose.yml down -v
```

## URLs downstream tests read

- Frontend URL: http://localhost:5174
- Backend URL:  http://localhost:3001
- DB:           SQLite (file-based, embedded in backend container at /app/data/app.db)

## Test-account source

详见 `docs/TDD/0.common/test-accounts.md`。

## Notes

- 启动后等 `/healthz` 返回 200 再开始测试。
- 容器初始 seed 由 `npx prisma db seed` 在 entrypoint 或手动触发（见 `## Reset data only`）。
- 每个项目通过 `docker-compose.yml` 顶层 `name:` 字段实现容器隔离。不同项目可同时运行互不影响（前提：端口不冲突）。如需同时运行多个项目，调整 `## URLs downstream tests read` 中的端口。
- **SQLite 是文件数据库**——没有独立 DB 容器或网络端口。数据持久化通过 named volume `opera-test-db-data` 实现；`down -v` 会清除该 volume。
- **`up -d --build` 只对 `build:` 配置的 service 生效**。如果某 service 在 `docker-compose.yml` 里用 `image: <registry>:<tag>` 引用外部 registry image（而不是 `build: ./<path>` 本地构建），`--build` 对它是 no-op —— Reload 命令不会拉取新版本。需要更新该 service 时，改用：
  ```bash
  docker compose -f docs/TDD/0.common/docker-compose.yml pull <service> && \
  docker compose -f docs/TDD/0.common/docker-compose.yml up -d <service>
  ```
  在 `## Services` 表的 `Notes` 列里把这种 service 标记为 `image-only (use --pull)`，下游 skill 看到该标记会改用 `pull + up -d` 替代 `up -d --build`。