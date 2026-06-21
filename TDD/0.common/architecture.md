# 架构契约

| 字段 | 值 |
|------|-----|
| Tier | 0（单体） |
| 方法档 | ADR-spine + 简单 ER + NFR 要点 |
| Tier 判定理由 | 单体本地应用——单一可部署单元（frontend + backend + SQLite embedded），无外部集成，9个业务模块为领域分区而非部署隔离，无跨模块数据归属冲突 |
| 派生自 | `tech-stack.md` + `PRD-Overview.md` |

---

## ① 系统上下文

本系统为八字（四柱命理）解析与论断工具，采用单体本地部署架构。前端（Vue 3）与后端（NestJS）+ 嵌入式 SQLite 同属一个可部署单元，无外部系统集成，全部计算在本地完成。用户通过浏览器访问，系统返回排盘、论断与报告结果。

---

## ② 模块依赖（Tier 0 简述）

本系统为 Tier 0 单体，不绘制 C4-L2 / DDD 上下文图。模块间依赖以数据引用关系为主，详见 §③ 数据归属与 §⑥ 约定表。

---

## ③ 数据归属（概念级 ER）

### 核心实体

| 实体 | 归属模块 | 说明 |
|------|----------|------|
| Chart（命盘） | 01-八字排盘与历法 | 四柱排盘结果，被模块 02-08 引用 |
| FiveElementAnalysis（五行分析） | 02-五行与十神 | 五行力量分布与旺衰判定 |
| TenGodAnalysis（十神分析） | 02-五行与十神 | 十神标注与格局判定 |
| CombinationClash（合冲刑害） | 03-合冲刑害 | 天干合化、地支合冲刑害 |
| DiseaseDiagnosis（辨病诊断） | 04-辨病与用神 | 病机识别与用神喜忌推导 |
| FortuneJudgment（断吉凶） | 04-辨病与用神 | 六维论断（性格/事业/财运/婚姻/健康/学业） |
| ShenSha（神煞） | 05-神煞标注 | 神煞识别与标注 |
| DaYun（大运） | 06-大运流年 | 起运与大运排列 |
| LiuNian（流年） | 06-大运流年 | 流年排列与岁运冲合刑害 |
| Report（论断报告） | 07-论断报告 | 报告章节组织与导出 |
| ChartHistory（命盘历史） | 08-命盘历史与比较 | 命盘保存管理 |
| Synastry（合盘/合婚） | 08-命盘历史与比较 | 双人合盘比较分析 |

### 实体关系（概念级）

- **Chart** 1→N **FiveElementAnalysis** / **TenGodAnalysis** / **CombinationClash** / **ShenSha** / **DaYun**
- **Chart** 1→1 **DiseaseDiagnosis** → 1→1 **FortuneJudgment**
- **Chart** 1→N **ChartHistory**
- **ChartHistory** 1→N **Report**
- **Chart** 2→1 **Synastry**（双人合盘）

### 数据归属原则

- 模块 01（排盘）创建并拥有 Chart，其他模块通过 Chart ID 引用
- 各分析结果由对应模块（02-06）拥有
- 报告由模块 07 拥有
- 历史与合盘由模块 08 拥有
- 模块 00（通用与外壳）不持有持久化数据

---

## ④ 模块间契约（Tier 0 简述）

Tier 0 不定义详细模块间契约。模块间通过 Chart ID 引用排盘数据，通过 REST API 同步调用。鉴权统一走 NestJS Guard（见 ADR-006）。

---

## ⑤ 非功能性需求要点

| 属性 | 内容 |
|------|------|
| 性能 | 单次排盘+全量论断 ≤2秒 (URS NFR-01); 前端命盘图表渲染 ≤500ms (URS NFR-01) |
| 可用性 | 尽力可用——本地单用户，无SLA |
| 安全 | 统一鉴权入口(NestJS Guard) + 本地数据不外传(URS NFR-05) |
| 规模/容量 | §⑩ 待补充 |
| 合规 | 无场景 |

---

## ⑥ 约定表

| # | 约定 | 取值 | ADR |
|---|------|------|-----|
| 1 | 时间存储 | UTC `timestamptz` | [ADR-001](#adr-001--时间存储使用-utc-timestamptz) |
| 2 | 软删除 | `deleted_at` 跨表统一 | [ADR-002](#adr-002--软删除统一使用-deleted_at) |
| 3 | 错误格式 | RFC7807 `application/problem+json` | [ADR-003](#adr-003--错误响应采用-rfc7807-format) |
| 4 | ID 策略 | 自增整数 (SQLite) | [ADR-004](#adr-004--id-策略采用自增整数sqlite) |
| 5 | 分页 | cursor 分页 | [ADR-005](#adr-005--分页采用-cursor-策略) |
| 6 | 鉴权入口 | 统一 NestJS Guard，禁各模块自造 | [ADR-006](#adr-006--鉴权统一使用-nestjs-guard) |
| 7 | 日志/审计格式 | 结构化 JSON + trace-id | [ADR-007](#adr-007--日志审计采用结构化-json--trace-id) |

---

## ⑦ ADR 日志

### ADR-001 · 时间存储使用 UTC timestamptz

- **状态**: accepted
- **背景**: 系统存储时间戳时需选择时区策略。本地单体应用，无跨时区用户，但数据一致性要求时间字段可比较、可排序。
- **决策**: 所有时间字段统一使用 UTC 存储，数据库类型为 `timestamptz`（SQLite 中以 TEXT 存储 ISO 8601 UTC 格式）。
- **理由**: 避免时区混淆；UTC 是无歧义的标准；SQLite 无原生 timestamptz 但 ISO 8601 TEXT 排序正确；前端负责本地化展示。
- **后果**: 前端展示时需做本地化转换；Prisma schema 中时间字段统一声明为 `DateTime`，运行时以 UTC 读写。

### ADR-002 · 软删除统一使用 deleted_at

- **状态**: accepted
- **背景**: 命盘历史、报告等数据需要可恢复的删除机制，同时满足审计追溯需求。
- **决策**: 全局统一使用 `deleted_at` 字段实现软删除，值为 `null` 表示未删除，值为 UTC 时间戳表示已删除时间。
- **理由**: 硬删除不可恢复，与命理数据需追溯的需求冲突；`deleted_at` 是最常见的软删除模式，Prisma 原生支持；统一字段名避免查询遗漏。
- **后果**: 所有查询默认需过滤 `deleted_at IS NULL`（可通过 Prisma middleware 统一处理）；数据物理体积持续增长，需定期归档策略（§⑩ 待补充）。

### ADR-003 · 错误响应采用 RFC7807 Format

- **状态**: accepted
- **背景**: 后端 API 错误响应需选择统一的格式约定，以便前端统一处理与展示。
- **决策**: 所有 API 错误响应采用 RFC7807 `application/problem+json` 格式，包含 `type`、`title`、`status`、`detail` 字段。
- **理由**: RFC7807 是 HTTP API 错误响应的业界标准，语义明确，机器可读；NestJS 有成熟的 exception filter 实现支持；前端可统一解析 `type` 字段做错误分类处理。
- **后果**: 后端需实现全局 ExceptionFilter 输出 RFC7807 格式；前端错误处理基于 `problem+json` 解析；禁止各模块自定义错误格式。

### ADR-004 · ID 策略采用自增整数（SQLite）

- **状态**: accepted
- **背景**: 需要为各实体的主键选择 ID 生成策略。
- **决策**: 所有实体主键使用 SQLite 自增整数（`INTEGER PRIMARY KEY AUTOINCREMENT`），Prisma 中声明为 `Int @default(autoincrement())`。
- **理由**: 本地单体应用无分布式 ID 需求；SQLite 自增整数性能最优、索引最小；自增 ID 对用户友好（命盘编号、报告编号等可读性好）；无需额外 ID 生成服务。
- **后果**: ID 不适合暴露给外部（本系统无外部接口，无此风险）；合并数据时需注意 ID 冲突（本系统为单库，无此问题）。

### ADR-005 · 分页采用 Cursor 策略

- **状态**: accepted
- **背景**: 命盘历史、报告列表等需要分页查询能力。
- **决策**: 列表 API 分页统一采用 cursor 分页（基于排序键 + `after`/`before` 参数），不使用 offset 分页。
- **理由**: cursor 分页在大数据集下性能稳定（不走 OFFSET）；命盘历史可能频繁新增数据，cursor 不会因并发插入导致数据跳过/重复；与自增整数 ID 天然适配（cursor = last seen ID）。
- **后果**: 前端需维护 cursor 状态而非简单页码；不支持随机跳页（与命理工具的使用场景无冲突）。

### ADR-006 · 鉴权统一使用 NestJS Guard

- **状态**: accepted
- **背景**: 系统 API 需要统一的鉴权入口，避免各模块自行实现认证逻辑。
- **决策**: 所有 API 鉴权统一通过 NestJS Guard（`@UseGuards(AuthGuard)`）实现，禁止各模块自造鉴权逻辑。Guard 负责验证 JWT Token 并注入用户上下文。
- **理由**: 单一鉴权入口便于维护和安全审计；NestJS Guard 是框架原生机制，与 DI 系统无缝集成；避免鉴权逻辑散落各模块导致安全漏洞。
- **后果**: 新增模块的 Controller 必须使用全局 Guard 或显式 `@UseGuards(AuthGuard)`；公开端点使用 `@Public()` 装饰器豁免；鉴权测试只需覆盖 Guard 单元。

### ADR-007 · 日志审计采用结构化 JSON + trace-id

- **状态**: accepted
- **背景**: 系统需要可追溯的日志格式，便于问题排查与行为审计。
- **决策**: 所有日志输出采用结构化 JSON 格式，每条日志携带 `trace-id` 用于关联同一请求的完整调用链。
- **理由**: 结构化 JSON 日志便于机器解析与检索；trace-id 是分布式/单体系统通用的请求追踪机制；NestJS 原生支持中间件注入 trace-id；本地应用虽无分布式场景，但 trace-id 有助于单次排盘请求的多步骤追踪。
- **后果**: 日志中间件需在请求入口生成/透传 trace-id；禁止使用 `console.log` 等非结构化输出；日志存储为本地文件，无远程采集（与 Tier 0 部署模式一致）。

---

## ⑧ 容器视图（Tier 0）

单体，见 `tech-stack.md` §5。

---

## ⑨ 部署拓扑（Tier 0）

单体，见 `tech-stack.md` §5。

---

## ⑩ 待补充/待确认

| # | 类别 | 项 | 来源 | 状态 |
|---|------|-----|------|------|
| 1 | NFR | 规模/容量指标（最大命盘数、并发用户等） | Q&A 确认无法推导 | 待补充 |