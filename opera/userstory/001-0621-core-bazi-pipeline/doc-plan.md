# 文档修改清单

### Task D-Last-1: Sync code-structure.md — 八字排盘与历法模块（01.01–01.04）

**Goal**: 在 Task D-1、D-2、D-3 完成后，更新 `docs/TDD/0.common/code-structure.md` 中模块 01 相关的路由、API 端点、功能映射与覆盖缺口章节，将"待实现"状态更新为"已实现"。

**Doc Paths**:

- docs/TDD/0.common/code-structure.md

**Implementation Steps**:

1. 将 `code-structure.md` §3 前端路由规划表中 `/chart`、`/chart/result` 路由的"状态"列从"待实现"更新为"已实现"
2. 将 `code-structure.md` §4 后端 API 规划表中 `POST /api/chart/calculate`、`GET /api/chart/:id`、`GET /api/calendar/lunar-solar`、`GET /api/calendar/jieqi` 端点的"状态"列从"待实现"更新为"已实现"
3. 将 `code-structure.md` §5.2 功能模块代码映射中 01.01–01.04 子模块的前端视图/组件、后端处理器/服务、跨切面代码路径的状态从"待实现"更新为"已实现"
4. 将 `code-structure.md` §7 覆盖缺口中 01.01–01.04 相关的路由、API 端点、数据模型条目从缺口列表中移除或标注为已实现
5. 更新 `code-structure.md` §6.4 数据模型总览中 `Chart`、`Pillar` 模型状态为"已实现"

**Acceptance**:

- `code-structure.md` 中模块 01 的所有路由、API 端点、功能映射条目状态更新为"已实现"
- §7 覆盖缺口不再包含模块 01 的路由、API 端点、数据模型条目

---

### Task D-Last-2: Sync code-structure.md — 五行与十神分析模块（02.01–02.04）

**Goal**: 在 Task D-4、D-5 完成后，更新 `docs/TDD/0.common/code-structure.md` 中模块 02 相关的路由、API 端点、功能映射与覆盖缺口章节。

**Doc Paths**:

- docs/TDD/0.common/code-structure.md

**Implementation Steps**:

1. 将 `code-structure.md` §3 前端路由规划表中 `/analysis/wuxing`、`/analysis/shishen`、`/analysis/geju` 路由的"状态"列从"待实现"更新为"已实现"
2. 将 `code-structure.md` §4 后端 API 规划表中 `GET /api/analysis/wuxing/:chartId`、`GET /api/analysis/wangshuai/:chartId`、`GET /api/analysis/shishen/:chartId`、`GET /api/analysis/geju/:chartId` 端点的"状态"列从"待实现"更新为"已实现"
3. 将 `code-structure.md` §5.3 功能模块代码映射中 02.01–02.04 子模块的前端视图/组件、后端处理器/服务、跨切面代码路径的状态从"待实现"更新为"已实现"
4. 将 `code-structure.md` §7 覆盖缺口中 02.01–02.04 相关的路由、API 端点、数据模型条目从缺口列表中移除或标注为已实现
5. 更新 `code-structure.md` §6.4 数据模型总览中 `WuxingStat`、`DayMasterStrength`、`ShishenLabel`、`GejuPattern` 模型状态为"已实现"

**Acceptance**:

- `code-structure.md` 中模块 02 的所有路由、API 端点、功能映射条目状态更新为"已实现"
- §7 覆盖缺口不再包含模块 02 的路由、API 端点、数据模型条目

---

### Task D-Last-3: Sync code-structure.md — 合冲刑害分析模块（03.01–03.04）

**Goal**: 在 Task D-6、D-7 完成后，更新 `docs/TDD/0.common/code-structure.md` 中模块 03 相关的路由、API 端点、功能映射与覆盖缺口章节。

**Doc Paths**:

- docs/TDD/0.common/code-structure.md

**Implementation Steps**:

1. 将 `code-structure.md` §3 前端路由规划表中 `/hechong` 路由的"状态"列从"待实现"更新为"已实现"
2. 将 `code-structure.md` §4 后端 API 规划表中 `GET /api/hechong/:chartId` 端点的"状态"列从"待实现"更新为"已实现"
3. 将 `code-structure.md` §5.4 功能模块代码映射中 03.01–03.04 子模块的前端视图/组件、后端处理器/服务、跨切面代码路径的状态从"待实现"更新为"已实现"
4. 将 `code-structure.md` §7 覆盖缺口中 03.01–03.04 相关的路由、API 端点、数据模型条目从缺口列表中移除或标注为已实现
5. 更新 `code-structure.md` §6.4 数据模型总览中 `HechongRelation` 模型状态为"已实现"

**Acceptance**:

- `code-structure.md` 中模块 03 的所有路由、API 端点、功能映射条目状态更新为"已实现"
- §7 覆盖缺口不再包含模块 03 的路由、API 端点、数据模型条目

---

### Task D-Last-4: Sync code-structure.md — 辨病与用神模块（04.01–04.04）

**Goal**: 在 Task D-8、D-9、D-10 完成后，更新 `docs/TDD/0.common/code-structure.md` 中模块 04 相关的路由、API 端点、功能映射与覆盖缺口章节。

**Doc Paths**:

- docs/TDD/0.common/code-structure.md

**Implementation Steps**:

1. 将 `code-structure.md` §3 前端路由规划表中 `/bing`、`/yongshen`、`/jixiong` 路由的"状态"列从"待实现"更新为"已实现"
2. 将 `code-structure.md` §4 后端 API 规划表中 `GET /api/bing/:chartId`、`GET /api/yongshen/:chartId`、`GET /api/jixiong/:chartId` 端点的"状态"列从"待实现"更新为"已实现"
3. 将 `code-structure.md` §5.5 功能模块代码映射中 04.01–04.04 子模块的前端视图/组件、后端处理器/服务、跨切面代码路径的状态从"待实现"更新为"已实现"
4. 将 `code-structure.md` §7 覆盖缺口中 04.01–04.04 相关的路由、API 端点、数据模型条目从缺口列表中移除或标注为已实现
5. 更新 `code-structure.md` §6.4 数据模型总览中 `BingMachine`、`YongShenJiXi`、`JiXiongVerdict` 模型状态为"已实现"

**Acceptance**:

- `code-structure.md` 中模块 04 的所有路由、API 端点、功能映射条目状态更新为"已实现"
- §7 覆盖缺口不再包含模块 04 的路由、API 端点、数据模型条目