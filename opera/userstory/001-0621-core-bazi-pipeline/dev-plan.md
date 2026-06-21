# 开发任务清单

## Task D-1: 四柱排盘核心计算与展示

- **Status**: done
- **Priority**: P0
- **Module**: docs/PRD/01. 八字排盘与历法模块/01. 四柱排盘/四柱排盘.md
- **Work Type**: feature

**Goal**: 实现四柱排盘的完整前后端功能——用户在"排盘输入页"（`/chart`，PRD 01.01 §Part 2）填写出生信息并提交，系统校验输入、计算四柱天干地支，在"四柱排盘结果页"（`/chart/result`，PRD 01.01 §Part 2）展示年柱、月柱、日柱、时柱的天干地支及五行属性。

**PRD Reference**: `docs/PRD/01. 八字排盘与历法模块/01. 四柱排盘/四柱排盘.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/01. 八字排盘与历法模块/01. 四柱排盘/四柱排盘-flow.md` §1, `docs/TDD/01. 八字排盘与历法模块/00.design/00.database-design.md`, `docs/TDD/01. 八字排盘与历法模块/00.design/01.api-design.md`

**Code Paths**:

- Frontend: `code/frontend/src/views/chart/ChartInputView.vue` (new file)
- Frontend: `code/frontend/src/views/chart/ChartResultView.vue` (new file)
- Frontend: `code/frontend/src/stores/chart.ts` (new file)
- Frontend: `code/frontend/src/services/chart-api.ts` (new file)
- Frontend: `code/frontend/src/router/index.ts` — `/chart` 与 `/chart/result` 路由注册 (new file)
- Backend: `code/backend/src/modules/chart/chart.module.ts` (new file)
- Backend: `code/backend/src/modules/chart/chart.controller.ts` (new file)
- Backend: `code/backend/src/modules/chart/chart.service.ts` (new file)
- Backend: `code/backend/src/modules/chart/dto/` (new file)
- Backend: `code/backend/src/modules/chart/lib/` — 天干地支推算、万年历数据 (new file)
- Backend: `code/backend/prisma/schema.prisma` — `Chart` 与 `Pillar` 模型 (new file)

**Constraints / ADR to respect**: ADR-001（时间存储 UTC timestamptz）、ADR-002（软删除 `deleted_at`）、ADR-003（错误格式 RFC7807）、ADR-004（ID 策略自增整数）、ADR-005（分页 cursor）、ADR-006（鉴权 NestJS Guard）、ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 创建 Prisma schema：定义 `Chart` 与 `Pillar` 模型，包含 `id`（自增整数，ADR-004）、`createdAt`/`updatedAt`（UTC，ADR-001）、`deletedAt`（软删除，ADR-002）字段 — `code/backend/prisma/schema.prisma` (new file)
2. 执行 Prisma 迁移生成 SQLite 表结构 — (orchestration)
3. 创建 `ChartModule`、`ChartController`、`ChartService`：实现 `POST /api/chart/calculate` 与 `GET /api/chart/:id` 端点，错误响应遵循 RFC7807（ADR-003） — `code/backend/src/modules/chart/chart.module.ts` (new file)、`code/backend/src/modules/chart/chart.controller.ts` (new file)、`code/backend/src/modules/chart/chart.service.ts` (new file)
4. 实现排盘计算核心逻辑：`calculateFourPillars()`（根据公历日期计算四柱天干地支）、`determineJieqiBoundary()`（确定节气交接点）、`handleZiHour()`（处理子时日柱归属） — `code/backend/src/modules/chart/lib/` (new file)
5. 创建 `ChartDto`：请求与响应 DTO，含输入校验 — `code/backend/src/modules/chart/dto/` (new file)
6. 创建前端 API 客户端：`chartApi.calculate()` 与 `chartApi.getChart()` — `code/frontend/src/services/chart-api.ts` (new file)
7. 创建 Pinia store：`useChartStore` 管理排盘数据与加载状态 — `code/frontend/src/stores/chart.ts` (new file)
8. 创建排盘输入页：实现"排盘输入页"（`/chart`，PRD 01.01 §Part 2），包含公历/农历选择、出生日期时间输入、性别选择、校验提示 — `code/frontend/src/views/chart/ChartInputView.vue` (new file)
9. 创建排盘结果页：实现"四柱排盘结果页"（`/chart/result`，PRD 01.01 §Part 2），展示年柱、月柱、日柱、时柱天干地支及五行属性 — `code/frontend/src/views/chart/ChartResultView.vue` (new file)
10. 注册 Vue Router 路由：`/chart` → `ChartInputView`、`/chart/result` → `ChartResultView` — `code/frontend/src/router/index.ts` (new file)
11. 端到端验证：通过"排盘输入页"提交出生信息，确认系统校验通过、排盘计算正确、"四柱排盘结果页"展示完整

**TCs covered by this Task**:

- TC-01.01-001 — 选择公历输入方式提交排盘：验证公历路径主流程
- TC-01.01-002 — 选择农历输入方式提交排盘：验证农历转换后排盘（依赖 D-3 农历转换服务）
- TC-01.01-003 — 必填字段缺失时提示校验错误：验证 `validateChartInput()` 校验逻辑
- TC-01.01-004 — 日期超出 1900–2100 有效范围时提示错误：验证日期范围校验
- TC-01.01-005 — 排盘结果展示四柱天干地支：验证"四柱排盘结果页"展示
- TC-01.01-006 — 各柱天干与地支标注五行属性：验证五行属性标注

**Acceptance**:

- 用户在"排盘输入页"（`/chart`）选择公历、填写出生信息并提交后，系统校验通过并跳转至"四柱排盘结果页"（`/chart/result`），正确展示四柱天干地支及五行属性
- 输入缺失或日期超出范围时，系统显示校验错误提示（RFC7807 格式）
- `POST /api/chart/calculate` 与 `GET /api/chart/:id` 端点正常响应

**Verification**:

1. 启动后端服务，调用 `POST /api/chart/calculate` 提交有效公历出生信息，确认返回 200 及完整排盘结果
2. 调用 `GET /api/chart/:id` 获取已保存排盘结果，确认返回 200
3. 提交缺失字段的请求，确认返回 RFC7807 格式错误（ADR-003）
4. 启动前端开发服务器，访问 `/chart` 页面，确认排盘输入表单渲染正确
5. 填写出生信息并提交，确认跳转至 `/chart/result` 页面并展示四柱天干地支

---

## Task D-2: 藏干日主与纳音五行展示

- **Status**: done
- **Priority**: P0
- **Module**: docs/PRD/01. 八字排盘与历法模块/02. 藏干与日主/藏干与日主.md, docs/PRD/01. 八字排盘与历法模块/04. 纳音五行/纳音五行.md
- **Work Type**: feature

**Goal**: 在四柱排盘结果页上扩展两个展示区域："藏干展示"（PRD 01.02 §Part 2）展示四柱各支的藏干（本气、中气、余气）与日主五行属性；"纳音五行显示"（PRD 01.04 §Part 2）提供纳音五行开关，开启后展示各柱纳音五行。

**PRD Reference**: `docs/PRD/01. 八字排盘与历法模块/02. 藏干与日主/藏干与日主.md` §Part 1, §Part 2, `docs/PRD/01. 八字排盘与历法模块/04. 纳音五行/纳音五行.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/01. 八字排盘与历法模块/02. 藏干与日主/藏干与日主-flow.md` §1, `docs/TDD/01. 八字排盘与历法模块/04. 纳音五行/纳音五行-flow.md` §1

**Code Paths**:

- Frontend: `code/frontend/src/components/chart/ZangGanPanel.vue` (new file)
- Frontend: `code/frontend/src/components/chart/NayinPanel.vue` (new file)
- Backend: `code/backend/src/modules/chart/lib/zanggan.ts` — 藏干推算逻辑 (new file)
- Backend: `code/backend/src/modules/chart/lib/nayin.ts` — 纳音五行对照表 (new file)

**Constraints / ADR to respect**: ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 实现藏干推算逻辑：`extractHiddenStems()` 提取四柱各支藏干（本气、中气、余气） — `code/backend/src/modules/chart/lib/zanggan.ts` (new file)
2. 实现纳音五行对照表：`lookupNayin()` 根据干支组合查找纳音五行 — `code/backend/src/modules/chart/lib/nayin.ts` (new file)
3. 扩展 `ChartService.calculate()`：在排盘计算中调用 `extractHiddenStems()` 与 `lookupNayin()`，将藏干与纳音五行数据包含在响应中 — `code/backend/src/modules/chart/chart.service.ts` (new file)
4. 创建"藏干展示"组件：实现四柱各支藏干列表展示，区分本气、中气、余气优先级（PRD 01.02 §Part 2） — `code/frontend/src/components/chart/ZangGanPanel.vue` (new file)
5. 创建"纳音五行显示"组件：实现纳音五行开关与各柱纳音五行展示（PRD 01.04 §Part 2） — `code/frontend/src/components/chart/NayinPanel.vue` (new file)
6. 将 `ZangGanPanel` 与 `NayinPanel` 嵌入 `ChartResultView`，确认日主五行属性与纳音五行含义悬浮提示展示

**TCs covered by this Task**:

- TC-01.02-001 — 四柱各支展示藏干列表：验证藏干推算与展示
- TC-01.02-002 — 藏干按本气中气余气区分优先级：验证藏干优先级标注
- TC-01.02-003 — 日柱天干标识为日主：验证日主识别与标注
- TC-01.02-004 — 日主五行属性标注展示：验证日主五行展示
- TC-01.02-005 — 日主五行含义悬浮提示：验证"术语悬浮提示"（PRD 01.02 §Part 2）
- TC-01.04-001 — 开启纳音五行显示开关后展示各柱纳音五行：验证开关切换
- TC-01.04-002 — 关闭纳音五行显示开关后隐藏纳音五行：验证开关关闭
- TC-01.04-003 — 各柱纳音五行含义悬浮提示：验证纳音含义提示
- TC-01.04-004 — 纳音五行对照表准确性验证：验证纳音推算逻辑

**Acceptance**:

- 四柱排盘结果页展示各柱地支藏干列表，按本气、中气、余气区分优先级
- 日柱天干标注为"日主"，并展示日主五行属性
- 纳音五行开关开启后，各柱展示纳音五行；关闭后隐藏
- 日主五行与纳音五行含义提供悬浮提示

**Verification**:

1. 提交排盘请求，确认响应包含藏干与纳音五行数据
2. 在"四柱排盘结果页"确认藏干面板展示正确，本气/中气/余气区分清晰
3. 确认日主天干高亮标注、五行属性正确
4. 切换纳音五行开关，确认开/关状态切换正常
5. 验证术语悬浮提示功能正常

---

## Task D-3: 农历与节气转换

- **Status**: done
- **Priority**: P0
- **Module**: docs/PRD/01. 八字排盘与历法模块/03. 农历与节气/农历与节气.md
- **Work Type**: feature

**Goal**: 实现农历与公历互转、"节气交接点查询"与"早子时夜子时处理"（PRD 01.03 §Part 1 §1.1–1.3），用户可在排盘输入页选择农历输入方式，系统转换为公历后继续排盘；系统根据节气交接点确定年月柱归属；系统标注子时处理方式。

**PRD Reference**: `docs/PRD/01. 八字排盘与历法模块/03. 农历与节气/农历与节气.md` §Part 1 §1.1–1.3, §Part 2

**TDD Reference**: `docs/TDD/01. 八字排盘与历法模块/03. 农历与节气/农历与节气-flow.md` §1, `docs/TDD/01. 八字排盘与历法模块/00.design/01.api-design.md`

**Code Paths**:

- Frontend: `code/frontend/src/components/chart/DatePicker.vue` (new file)
- Frontend: `code/frontend/src/components/chart/JieqiSelector.vue` (new file)
- Frontend: `code/frontend/src/services/calendar-api.ts` (new file)
- Backend: `code/backend/src/modules/calendar/calendar.module.ts` (new file)
- Backend: `code/backend/src/modules/calendar/calendar.controller.ts` (new file)
- Backend: `code/backend/src/modules/calendar/calendar.service.ts` (new file)
- Backend: `code/backend/src/modules/calendar/lib/` — 农历数据库与节气计算逻辑 (new file)
- Backend: `code/backend/src/modules/chart/lib/zhourule.ts` — 早子时夜子时处理逻辑 (new file)

**Constraints / ADR to respect**: ADR-003（错误格式 RFC7807）、ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 创建 `CalendarModule`、`CalendarController`、`CalendarService`：实现 `GET /api/calendar/lunar-solar`（农历公历互转）与 `GET /api/calendar/jieqi`（节气交接点查询）端点 — `code/backend/src/modules/calendar/calendar.module.ts` (new file)、`code/backend/src/modules/calendar/calendar.controller.ts` (new file)、`code/backend/src/modules/calendar/calendar.service.ts` (new file)
2. 实现农历数据库与转换逻辑：`convertLunarToSolar()` 与 `convertSolarToLunar()` — `code/backend/src/modules/calendar/lib/` (new file)
3. 实现节气交接点计算逻辑：`getJieqiBoundary()` 返回指定年份的 24 节气交接时刻 — `code/backend/src/modules/calendar/lib/` (new file)
4. 实现早子时夜子时处理逻辑：`handleZiHour()` 根据出生时间在 23:00–01:00 区间确定日柱归属与子时处理方式 — `code/backend/src/modules/chart/lib/zhourule.ts` (new file)
5. 扩展 `ChartService.calculate()`：当 `birthDateType` 为 `"lunar"` 时调用 `CalendarService.convert()` 转换公历（TDD 四柱排盘-flow §1 step 4） — `code/backend/src/modules/chart/chart.service.ts` (new file)
6. 创建前端 API 客户端：`calendarApi.convert()` 与 `calendarApi.getJieqi()` — `code/frontend/src/services/calendar-api.ts` (new file)
7. 创建"日期选择"组件：支持公历/农历输入切换，农历模式下调用转换 API（PRD 01.03 §Part 2 "公历农历互转"） — `code/frontend/src/components/chart/DatePicker.vue` (new file)
8. 创建"节气选择"组件：展示出生时刻对应的节气交接点与年月柱归属（PRD 01.03 §Part 2 "节气交接点查询"） — `code/frontend/src/components/chart/JieqiSelector.vue` (new file)
9. 将 `DatePicker` 与 `JieqiSelector` 嵌入 `ChartInputView`，确认农历输入路径与节气展示正常

**TCs covered by this Task**:

- TC-01.03-001 — 农历转公历正确性验证：验证 `GET /api/calendar/lunar-solar` 转换结果
- TC-01.03-002 — 公历转农历逆向验证：验证反向转换结果
- TC-01.03-003 — 农历日期超出支持范围时提示错误：验证日期范围校验
- TC-01.03-004 — 节气交接点查询返回正确节气与时刻：验证 `GET /api/calendar/jieqi`
- TC-01.03-005 — 立春前出生年柱归属上一年：验证年柱归属逻辑
- TC-01.03-006 — 立春后出生年柱归属本年：验证年柱归属逻辑
- TC-01.03-007 — 早子时（23:00–00:00）日柱归属当日：验证早子时处理
- TC-01.03-008 — 夜子时（00:00–01:00）日柱归属新一日：验证夜子时处理
- TC-01.03-009 — 非子时出生时间按常规规则确定日柱与时柱：验证常规时柱规则

**Acceptance**:

- 用户在排盘输入页选择农历输入方式并填写农历日期，系统转换为公历后成功排盘
- 系统根据公历日期查找节气交接点，正确确定年月柱归属
- 系统对子时出生时间正确标注处理方式（早子时/夜子时）

**Verification**:

1. 调用 `GET /api/calendar/lunar-solar` 提交农历日期，确认返回正确公历日期
2. 调用 `GET /api/calendar/jieqi` 提交公历日期，确认返回节气交接时刻
3. 在排盘输入页选择农历输入，填写农历日期并提交，确认排盘结果正确
4. 测试立春前后日期的年柱归属是否正确
5. 测试子时出生时间的日柱归属标注

---

## Task D-4: 五行力量统计与日主旺衰判定

- **Status**: done
- **Priority**: P0
- **Module**: docs/PRD/02. 五行与十神分析模块/01. 五行力量统计/五行力量统计.md, docs/PRD/02. 五行与十神分析模块/02. 日主旺衰判定/日主旺衰判定.md
- **Work Type**: feature

**Goal**: 实现"五行力量分布页"（`/analysis/wuxing`，PRD 02.01 §Part 2）展示五行力量分布、缺失与过旺标注；实现"日主旺衰判定页"展示得令得地得助与旺衰结论（PRD 02.02 §Part 2）。用户在排盘完成后查看五行分析与日主旺衰。

**PRD Reference**: `docs/PRD/02. 五行与十神分析模块/01. 五行力量统计/五行力量统计.md` §Part 1, §Part 2, `docs/PRD/02. 五行与十神分析模块/02. 日主旺衰判定/日主旺衰判定.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/02. 五行与十神分析模块/01. 五行力量统计/五行力量统计-flow.md` §1, `docs/TDD/02. 五行与十神分析模块/02. 日主旺衰判定/日主旺衰判定-flow.md` §1, `docs/TDD/02. 五行与十神分析模块/00.design/00.database-design.md`, `docs/TDD/02. 五行与十神分析模块/00.design/01.api-design.md`

**Code Paths**:

- Frontend: `code/frontend/src/views/analysis/WuxingView.vue` (new file)
- Frontend: `code/frontend/src/components/analysis/WangShuaiPanel.vue` (new file)
- Frontend: `code/frontend/src/stores/analysis.ts` (new file)
- Frontend: `code/frontend/src/services/analysis-api.ts` (new file)
- Backend: `code/backend/src/modules/analysis/analysis.module.ts` (new file)
- Backend: `code/backend/src/modules/analysis/wuxing.controller.ts` (new file)
- Backend: `code/backend/src/modules/analysis/wuxing.service.ts` (new file)
- Backend: `code/backend/src/modules/analysis/wangshuai.controller.ts` (new file)
- Backend: `code/backend/src/modules/analysis/wangshuai.service.ts` (new file)
- Backend: `code/backend/src/modules/analysis/lib/wuxing-calculator.ts` (new file)
- Backend: `code/backend/src/modules/analysis/lib/wangshuai-judge.ts` (new file)
- Backend: `code/backend/prisma/schema.prisma` — `WuxingStat` 与 `DayMasterStrength` 模型 (new file)

**Constraints / ADR to respect**: ADR-001（时间存储 UTC）、ADR-002（软删除 `deleted_at`）、ADR-003（错误格式 RFC7807）、ADR-004（ID 自增整数）、ADR-006（鉴权 NestJS Guard）、ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 扩展 Prisma schema：添加 `WuxingStat` 与 `DayMasterStrength` 模型（ADR-004 自增 ID，ADR-001 UTC 时间，ADR-002 软删除） — `code/backend/prisma/schema.prisma` (new file)
2. 执行 Prisma 迁移 — (orchestration)
3. 创建 `AnalysisModule`：包含五行与日主旺衰子模块 — `code/backend/src/modules/analysis/analysis.module.ts` (new file)
4. 实现五行力量统计计算逻辑：`calculateWuxingStats()` 统计天干五行个数、地支本气五行个数、月令旺衰加权（PRD 02.01 §Part 1 §1.1） — `code/backend/src/modules/analysis/lib/wuxing-calculator.ts` (new file)
5. 实现五行缺失与过旺识别逻辑：`identifyMissingAndExcess()` 标注五行缺失与过旺（PRD 02.01 §Part 1 §1.2） — `code/backend/src/modules/analysis/lib/wuxing-calculator.ts` (new file)
6. 实现 `WuxingController` 与 `WuxingService`：`GET /api/analysis/wuxing/:chartId` 端点（ADR-003 错误格式，ADR-006 Guard） — `code/backend/src/modules/analysis/wuxing.controller.ts` (new file)、`code/backend/src/modules/analysis/wuxing.service.ts` (new file)
7. 实现日主旺衰判定逻辑：`judgeDayMasterStrength()` 判断得令、得地、得助并输出身旺/身弱/从强/从弱结论（PRD 02.02 §Part 1 §1.1） — `code/backend/src/modules/analysis/lib/wangshuai-judge.ts` (new file)
8. 实现 `WangShuaiController` 与 `WangShuaiService`：`GET /api/analysis/wangshuai/:chartId` 端点 — `code/backend/src/modules/analysis/wangshuai.controller.ts` (new file)、`code/backend/src/modules/analysis/wangshuai.service.ts` (new file)
9. 创建前端 API 客户端：`analysisApi.getWuxing()` 与 `analysisApi.getWangShuai()` — `code/frontend/src/services/analysis-api.ts` (new file)
10. 创建 Pinia store：`useAnalysisStore` 管理五行与旺衰数据 — `code/frontend/src/stores/analysis.ts` (new file)
11. 创建"五行力量分布页"：展示天干五行统计、地支本气五行统计、月令旺衰加权分布、五行缺失与过旺标注（PRD 02.01 §Part 2） — `code/frontend/src/views/analysis/WuxingView.vue` (new file)
12. 创建"日主旺衰判定"面板：展示日主五行属性、得令/得地/得助判断、旺衰结论（PRD 02.02 §Part 2） — `code/frontend/src/components/analysis/WangShuaiPanel.vue` (new file)
13. 注册 Vue Router 路由：`/analysis/wuxing` → `WuxingView` — `code/frontend/src/router/index.ts` (new file)

**TCs covered by this Task**:

- TC-02.01-001 — 五行力量分布页展示天干五行个数统计：验证统计计算正确性
- TC-02.01-002 — 五行力量分布页展示地支本气五行个数统计：验证统计计算
- TC-02.01-003 — 月令旺衰加权后五行力量分布展示：验证加权计算
- TC-02.01-004 — 五行缺失标注：验证缺失五行识别
- TC-02.01-005 — 五行过旺标注：验证过旺五行识别
- TC-02.01-006 — 五行分布正常（无缺失无过旺）时不标注：验证正常情况
- TC-02.01-007 — 无效命盘 ID 请求五行统计返回错误：验证错误处理
- TC-02.02-001 — 日主身旺判定：验证得令+得地+得助导致身旺
- TC-02.02-002 — 日主身弱判定：验证失令+失地+无助导致身弱
- TC-02.02-003 — 日主从强判定：验证极旺且无可克泄导致从强
- TC-02.02-004 — 日主从弱判定：验证极弱且无生扶导致从弱
- TC-02.02-005 — 得令判断展示：验证月令是否生扶日主
- TC-02.02-006 — 得地判断展示：验证地支是否为日主之根
- TC-02.02-007 — 得助判断展示：验证天干是否有同类或生扶日主
- TC-02.02-008 — 日主旺衰结论标注（身旺/身弱/从强/从弱）：验证旺衰结论
- TC-02.02-009 — 日主旺衰适中（中和）判定：验证中和情况
- TC-02.02-010 — 无效命盘 ID 请求旺衰判定返回错误：验证错误处理

**Acceptance**:

- 用户在"五行力量分布页"（`/analysis/wuxing`）查看命盘五行分析，系统展示天干五行统计、地支本气五行统计、月令旺衰加权分布、缺失与过旺标注
- 用户在旺衰面板查看日主旺衰判定，系统展示得令/得地/得助判断与旺衰结论（身旺/身弱/从强/从弱）
- `GET /api/analysis/wuxing/:chartId` 与 `GET /api/analysis/wangshuai/:chartId` 端点正常响应

**Verification**:

1. 调用 `GET /api/analysis/wuxing/:chartId`，确认返回五行力量统计数据
2. 调用 `GET /api/analysis/wangshuai/:chartId`，确认返回日主旺衰判定数据
3. 在前端访问 `/analysis/wuxing`，确认五行分布页与旺衰面板渲染正确
4. 验证五行缺失与过旺标注显示正确

---

## Task D-5: 十神标注与格局判定

- **Status**: done
- **Priority**: P1
- **Module**: docs/PRD/02. 五行与十神分析模块/03. 十神标注/十神标注.md, docs/PRD/02. 五行与十神分析模块/04. 格局判定与喜忌/格局判定与喜忌.md
- **Work Type**: feature

**Goal**: 实现"十神标注页"（`/analysis/shishen`，PRD 02.03 §Part 2）展示天干与藏干十神标注；实现"格局判定页"（`/analysis/geju`，PRD 02.04 §Part 2）展示格局类型与喜忌初步论断。

**PRD Reference**: `docs/PRD/02. 五行与十神分析模块/03. 十神标注/十神标注.md` §Part 1, §Part 2, `docs/PRD/02. 五行与十神分析模块/04. 格局判定与喜忌/格局判定与喜忌.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/02. 五行与十神分析模块/03. 十神标注/十神标注-flow.md` §1, `docs/TDD/02. 五行与十神分析模块/04. 格局判定与喜忌/格局判定与喜忌-flow.md` §1

**Code Paths**:

- Frontend: `code/frontend/src/views/analysis/ShishenView.vue` (new file)
- Frontend: `code/frontend/src/views/analysis/GejuXijiView.vue` (new file)
- Backend: `code/backend/src/modules/analysis/shishen.controller.ts` (new file)
- Backend: `code/backend/src/modules/analysis/shishen.service.ts` (new file)
- Backend: `code/backend/src/modules/analysis/geju.controller.ts` (new file)
- Backend: `code/backend/src/modules/analysis/geju.service.ts` (new file)
- Backend: `code/backend/src/modules/analysis/lib/shishen-calculator.ts` (new file)
- Backend: `code/backend/src/modules/analysis/lib/geju-judge.ts` (new file)
- Backend: `code/backend/prisma/schema.prisma` — `ShishenLabel` 与 `GejuPattern` 模型 (new file)

**Constraints / ADR to respect**: ADR-001（时间存储 UTC）、ADR-002（软删除）、ADR-003（错误格式 RFC7807）、ADR-004（ID 自增整数）、ADR-006（鉴权 NestJS Guard）

**Implementation Steps**:

1. 扩展 Prisma schema：添加 `ShishenLabel` 与 `GejuPattern` 模型 — `code/backend/prisma/schema.prisma` (new file)
2. 执行 Prisma 迁移 — (orchestration)
3. 实现十神取法核心逻辑：`calculateShishen()` 以日主天干为基准判断阴阳五行关系，标注天干与藏干十神（PRD 02.03 §Part 1 §1.1） — `code/backend/src/modules/analysis/lib/shishen-calculator.ts` (new file)
4. 实现 `ShishenController` 与 `ShishenService`：`GET /api/analysis/shishen/:chartId` 端点 — `code/backend/src/modules/analysis/shishen.controller.ts` (new file)、`code/backend/src/modules/analysis/shishen.service.ts` (new file)
5. 实现格局取法与喜忌推导逻辑：`determineGeju()` 根据月令本气十神确定格局类型，`deriveXiji()` 结合日主旺衰推导喜神与忌神（PRD 02.04 §Part 1 §1.1–1.2） — `code/backend/src/modules/analysis/lib/geju-judge.ts` (new file)
6. 实现 `GejuController` 与 `GejuService`：`GET /api/analysis/geju/:chartId` 端点 — `code/backend/src/modules/analysis/geju.controller.ts` (new file)、`code/backend/src/modules/analysis/geju.service.ts` (new file)
7. 扩展前端 API 客户端：`analysisApi.getShishen()` 与 `analysisApi.getGeju()` — `code/frontend/src/services/analysis-api.ts` (new file)
8. 创建"十神标注页"：展示四柱天干十神与藏干十神标注（PRD 02.03 §Part 2） — `code/frontend/src/views/analysis/ShishenView.vue` (new file)
9. 创建"格局判定与喜忌页"：展示格局类型（正官格、偏官格等）、成格/破格状态、喜神与忌神列表（PRD 02.04 §Part 2） — `code/frontend/src/views/analysis/GejuXijiView.vue` (new file)
10. 注册 Vue Router 路由：`/analysis/shishen` → `ShishenView`、`/analysis/geju` → `GejuXijiView` — `code/frontend/src/router/index.ts` (new file)

**TCs covered by this Task**:

- TC-02.03-001 — 四柱天干十神标注展示：验证天干十神计算正确性
- TC-02.03-002 — 地支藏干十神标注展示：验证藏干十神计算正确性
- TC-02.03-003 — 十神与日主阴阳五行关系对应：验证十神取法逻辑
- TC-02.03-004 — 无效命盘 ID 请求十神标注返回错误：验证错误处理
- TC-02.04-001 — 格局成格判定——正官格：验证月令本气十神为正官
- TC-02.04-002 — 格局成格判定——偏官格：验证月令本气十神为偏官
- TC-02.04-003 — 格局成格判定——食神格：验证月令本气十神为食神
- TC-02.04-004 — 格局破败标注——破格原因：验证破格识别
- TC-02.04-005 — 日主身旺时喜忌推导——克泄耗为喜：验证喜忌推导
- TC-02.04-006 — 日主身弱时喜忌推导——生扶为喜：验证喜忌推导
- TC-02.04-007 — 格局类型与喜忌列表展示：验证页面展示
- TC-02.04-008 — 无效命盘 ID 请求格局判定返回错误：验证错误处理

**Acceptance**:

- 用户在"十神标注页"查看命盘十神标注，系统展示四柱天干十神与藏干十神
- 用户在"格局判定与喜忌页"查看格局类型、成格/破格状态与喜忌列表
- `GET /api/analysis/shishen/:chartId` 与 `GET /api/analysis/geju/:chartId` 端点正常响应

**Verification**:

1. 调用 `GET /api/analysis/shishen/:chartId`，确认返回十神标注数据
2. 调用 `GET /api/analysis/geju/:chartId`，确认返回格局与喜忌数据
3. 在前端访问 `/analysis/shishen` 与 `/analysis/geju`，确认页面渲染正确
4. 验证十神取法与格局判定逻辑与 PRD 描述一致

---

## Task D-6: 天干合化与地支合局

- **Status**: done
- **Priority**: P1
- **Module**: docs/PRD/03. 合冲刑害分析模块/01. 天干合化/天干合化.md, docs/PRD/03. 合冲刑害分析模块/02. 地支合局/地支合局.md
- **Work Type**: feature

**Goal**: 实现"天干合化结果页"（PRD 03.01 §Part 2）展示天干五合组合、合化状态与化出五行；实现"地支合局结果"（PRD 03.02 §Part 2）展示六合三合结果与力量等级。两者均嵌于合冲刑害分析页（`/hechong`）。

**PRD Reference**: `docs/PRD/03. 合冲刑害分析模块/01. 天干合化/天干合化.md` §Part 1, §Part 2, `docs/PRD/03. 合冲刑害分析模块/02. 地支合局/地支合局.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/03. 合冲刑害分析模块/01. 天干合化/天干合化-flow.md` §1, `docs/TDD/03. 合冲刑害分析模块/02. 地支合局/地支合局-flow.md` §1

**Code Paths**:

- Frontend: `code/frontend/src/views/hechong/HechongView.vue` (new file)
- Frontend: `code/frontend/src/components/hechong/TianganHePanel.vue` (new file)
- Frontend: `code/frontend/src/components/hechong/DizhiHePanel.vue` (new file)
- Frontend: `code/frontend/src/stores/hechong.ts` (new file)
- Frontend: `code/frontend/src/services/hechong-api.ts` (new file)
- Backend: `code/backend/src/modules/hechong/hechong.module.ts` (new file)
- Backend: `code/backend/src/modules/hechong/hechong.controller.ts` (new file)
- Backend: `code/backend/src/modules/hechong/hechong.service.ts` (new file)
- Backend: `code/backend/src/modules/hechong/lib/tiangan-he.ts` (new file)
- Backend: `code/backend/src/modules/hechong/lib/dizhi-he.ts` (new file)
- Backend: `code/backend/prisma/schema.prisma` — `HechongRelation` 模型 (new file)

**Constraints / ADR to respect**: ADR-001（时间存储 UTC）、ADR-002（软删除）、ADR-003（错误格式 RFC7807）、ADR-004（ID 自增整数）、ADR-006（鉴权 NestJS Guard）、ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 扩展 Prisma schema：添加 `HechongRelation` 模型 — `code/backend/prisma/schema.prisma` (new file)
2. 执行 Prisma 迁移 — (orchestration)
3. 创建 `HechongModule`、`HechongController`、`HechongService`：实现 `GET /api/hechong/:chartId` 端点 — `code/backend/src/modules/hechong/hechong.module.ts` (new file)、`code/backend/src/modules/hechong/hechong.controller.ts` (new file)、`code/backend/src/modules/hechong/hechong.service.ts` (new file)
4. 实现天干五合规则库：`identifyTianganHe()` 识别四柱间天干五合组合，`judgeHehuaSuccess()` 判断合化是否成功（PRD 03.01 §Part 1 §1.1–1.2） — `code/backend/src/modules/hechong/lib/tiangan-he.ts` (new file)
5. 实现地支六合三合规则库：`identifyDizhiHe()` 识别六合与三合局组合，判断合局成立条件与力量等级（PRD 03.02 §Part 1 §1.1–1.2） — `code/backend/src/modules/hechong/lib/dizhi-he.ts` (new file)
6. 在 `HechongService` 中聚合天干合化与地支合局结果 — `code/backend/src/modules/hechong/hechong.service.ts` (new file)
7. 创建前端 API 客户端：`hechongApi.getRelations()` — `code/frontend/src/services/hechong-api.ts` (new file)
8. 创建 Pinia store：`useHechongStore` 管理合冲刑害数据 — `code/frontend/src/stores/hechong.ts` (new file)
9. 创建"合冲刑害分析页"：聚合天干合化、地支合局展示 — `code/frontend/src/views/hechong/HechongView.vue` (new file)
10. 创建"天干合化"面板：展示五合组合、合化状态与化出五行（PRD 03.01 §Part 2） — `code/frontend/src/components/hechong/TianganHePanel.vue` (new file)
11. 创建"地支合局"面板：展示六合三合结果与力量等级（PRD 03.02 §Part 2） — `code/frontend/src/components/hechong/DizhiHePanel.vue` (new file)
12. 注册 Vue Router 路由：`/hechong` → `HechongView` — `code/frontend/src/router/index.ts` (new file)

**TCs covered by this Task**:

- TC-03.01-001 — 天干五合组合识别：验证甲己合等五合组合
- TC-03.01-002 — 合化成功判定——化出五行得令得势：验证合化成功条件
- TC-03.01-003 — 合而不化标注——化出五行不得令：验证合而不化状态
- TC-03.01-004 — 合化成功组合展示化出五行属性：验证化出五行展示
- TC-03.01-005 — 合而不化组合展示原因：验证合而不化原因
- TC-03.01-006 — 无天干合组合时不展示：验证无合化情况
- TC-03.01-007 — 无效命盘 ID 请求天干合化返回错误：验证错误处理
- TC-03.02-001 — 地支六合组合识别：验证六合规则
- TC-03.02-002 — 六合成立条件——紧邻且得令得势：验证六合成立
- TC-03.02-003 — 六合合而不化——不得令：验证六合不化
- TC-03.02-004 — 遥合标注——非紧邻六合力量减弱：验证遥合
- TC-03.02-005 — 地支三合局组合识别——三字齐全：验证三合局识别
- TC-03.02-006 — 三合局成立——得令得势：验证三合局成立
- TC-03.02-007 — 三合局合而不化——不得令：验证三合局不化
- TC-03.02-008 — 半合局——仅两字：验证半合局标注
- TC-03.02-009 — 三合局力量等级展示：验证力量等级
- TC-03.02-010 — 无效命盘 ID 请求地支合局返回错误：验证错误处理

**Acceptance**:

- 用户在"合冲刑害分析页"（`/hechong`）查看天干合化与地支合局分析
- "天干合化"面板展示五合组合列表、合化状态（成功/合而不化）、化出五行
- "地支合局"面板展示六合三合结果、力量等级
- `GET /api/hechong/:chartId` 端点正常响应

**Verification**:

1. 调用 `GET /api/hechong/:chartId`，确认返回天干合化与地支合局数据
2. 在前端访问 `/hechong`，确认天干合化与地支合局面板渲染正确
3. 验证天干五合组合识别与合化判定逻辑与 PRD 描述一致
4. 验证地支六合三合识别与力量等级判定逻辑与 PRD 描述一致

---

## Task D-7: 冲刑害与合冲刑害辨病

- **Status**: done
- **Priority**: P1
- **Module**: docs/PRD/03. 合冲刑害分析模块/03. 冲刑害分析/冲刑害分析.md, docs/PRD/03. 合冲刑害分析模块/04. 合冲刑害辨病/合冲刑害辨病.md
- **Work Type**: feature

**Goal**: 实现"六冲分析页"（PRD 03.03 §Part 2）展示六冲三刑六害自刑关系与影响分析；实现"合冲刑害辨病"（PRD 03.04 §Part 1）评估合冲刑害是否构成病机（合绊用神、冲破格局、刑害伤喜神），汇总辨病结果供用神推导使用。

**PRD Reference**: `docs/PRD/03. 合冲刑害分析模块/03. 冲刑害分析/冲刑害分析.md` §Part 1, §Part 2, `docs/PRD/03. 合冲刑害分析模块/04. 合冲刑害辨病/合冲刑害辨病.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/03. 合冲刑害分析模块/03. 冲刑害分析/冲刑害分析-flow.md` §1, `docs/TDD/03. 合冲刑害分析模块/04. 合冲刑害辨病/合冲刑害辨病.md` §1`

**Code Paths**:

- Frontend: `code/frontend/src/components/hechong/ChongXingHaiPanel.vue` (new file)
- Frontend: `code/frontend/src/components/hechong/HechongBingPanel.vue` (new file)
- Backend: `code/backend/src/modules/hechong/lib/chong-xing-hai.ts` (new file)
- Backend: `code/backend/src/modules/hechong/lib/hechong-bing.ts` (new file)

**Constraints / ADR to respect**: ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 实现六冲三刑六害自刑规则库：`identifyChong()` 识别六冲组合，`identifyXing()` 识别三刑组合，`identifyHai()` 识别六害组合，`identifyZiXing()` 识别自刑（PRD 03.03 §Part 1 §1.1–1.2） — `code/backend/src/modules/hechong/lib/chong-xing-hai.ts` (new file)
2. 在 `HechongService.getRelations()` 中聚合冲刑害识别结果 — `code/backend/src/modules/hechong/hechong.service.ts` (new file)
3. 实现合冲刑害辨病判定逻辑：`evaluateHechongBing()` 评估合绊用神、冲破格局、刑害伤喜神病机（PRD 03.04 §Part 1 §1.1–1.2），汇总辨病结果输出至辨病与用神模块 — `code/backend/src/modules/hechong/lib/hechong-bing.ts` (new file)
4. 在 `HechongService.getRelations()` 响应中包含辨病判定字段 — `code/backend/src/modules/hechong/hechong.service.ts` (new file)
5. 创建"冲刑害分析"面板：展示六冲组合与冲力方向、三刑组合与刑力类型、六害组合与害力方向、自刑影响标注（PRD 03.03 §Part 2） — `code/frontend/src/components/hechong/ChongXingHaiPanel.vue` (new file)
6. 创建"合冲刑害辨病"面板：展示合绊用神病机、冲破格局病机、刑害伤喜神病机标注（PRD 03.04 §Part 2） — `code/frontend/src/components/hechong/HechongBingPanel.vue` (new file)
7. 将 `ChongXingHaiPanel` 与 `HechongBingPanel` 嵌入 `HechongView`，确认冲刑害与辨病展示正常

**TCs covered by this Task**:

- TC-03.03-001 — 六冲组合识别：验证冲力方向标注
- TC-03.03-002 — 六冲受冲十神标注：验证冲力对十神的影响
- TC-03.03-003 — 三刑组合识别：验证刑力类型标注
- TC-03.03-004 — 六害组合识别：验证害力方向标注
- TC-03.03-005 — 自刑识别与内部冲突影响标注：验证自刑标注
- TC-03.03-006 — 冲刑害对格局与五行平衡影响评估：验证影响分析
- TC-03.03-007 — 无冲刑害组合时不展示：验证无冲突情况
- TC-03.03-008 — 冲刑害关系与影响综合展示：验证综合展示
- TC-03.03-009 — 无效命盘 ID 请求冲刑害分析返回错误：验证错误处理
- TC-03.04-001 — 合绊用神病机标注：验证合化涉及用神且用神失去效力
- TC-03.04-002 — 合绊用神但未完全失去效力——严重程度为微恙：验证合绊程度
- TC-03.04-003 — 冲破格局病机标注：验证冲破格局识别
- TC-03.04-004 — 刑害伤喜神病机标注：验证刑害伤喜神识别
- TC-03.04-005 — 合冲刑害不构成病机——标注为无病机：验证无病机情况
- TC-03.04-006 — 辨病结果汇总输出至用神推导：验证结果传递
- TC-03.04-007 — 合冲刑害辨病结果展示：验证面板展示
- TC-03.04-008 — 无效命盘 ID 请求合冲刑害辨病返回错误：验证错误处理

**Acceptance**:

- 用户在"合冲刑害分析页"查看六冲、三刑、六害、自刑关系与影响分析
- 辨病面板展示合绊用神、冲破格局、刑害伤喜神等病机标注
- 辨病结果可供用神推导模块使用

**Verification**:

1. 调用 `GET /api/hechong/:chartId`，确认响应包含冲刑害数据与辨病判定字段
2. 在前端 `/hechong` 页面确认冲刑害与辨病面板渲染正确
3. 验证六冲三刑六害自刑识别逻辑与 PRD 描述一致
4. 验证辨病判定逻辑与 PRD 描述一致

---

## Task D-8: 识病诊断

- **Status**: done
- **Priority**: P1
- **Module**: docs/PRD/04. 辨病与用神模块/01. 识病诊断/识病诊断.md
- **Work Type**: feature

**Goal**: 实现"病机诊断总览页"（`/bing`，PRD 04.01 §Part 2），汇总排盘+五行+十神+格局+合冲刑害数据，逐项检测八大病机类型（日主过旺、日主过弱、五行偏枯、五行缺漏、十神交战、格局破败、合绊用神、寒暖湿燥失衡），输出病名、病位、病象与严重程度。

**PRD Reference**: `docs/PRD/04. 辨病与用神模块/01. 识病诊断/识病诊断.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/04. 辨病与用神模块/01. 识病诊断/识病诊断-flow.md` §1, `docs/TDD/04. 辨病与用神模块/00.design/00.database-design.md`, `docs/TDD/04. 辨病与用神模块/00.design/01.api-design.md`

**Code Paths**:

- Frontend: `code/frontend/src/views/bing/BingDiagnosisView.vue` (new file)
- Frontend: `code/frontend/src/stores/bing.ts` (new file)
- Frontend: `code/frontend/src/services/bing-api.ts` (new file)
- Backend: `code/backend/src/modules/bing/bing.module.ts` (new file)
- Backend: `code/backend/src/modules/bing/bing.controller.ts` (new file)
- Backend: `code/backend/src/modules/bing/bing.service.ts` (new file)
- Backend: `code/backend/src/modules/bing/lib/bing-detector.ts` (new file)
- Backend: `code/backend/prisma/schema.prisma` — `BingMachine` 模型 (new file)

**Constraints / ADR to respect**: ADR-001（时间存储 UTC）、ADR-002（软删除）、ADR-003（错误格式 RFC7807）、ADR-004（ID 自增整数）、ADR-006（鉴权 NestJS Guard）、ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 扩展 Prisma schema：添加 `BingMachine` 模型 — `code/backend/prisma/schema.prisma` (new file)
2. 执行 Prisma 迁移 — (orchestration)
3. 创建 `BingModule`、`BingController`、`BingService`：实现 `GET /api/bing/:chartId` 端点 — `code/backend/src/modules/bing/bing.module.ts` (new file)、`code/backend/src/modules/bing/bing.controller.ts` (new file)、`code/backend/src/modules/bing/bing.service.ts` (new file)
4. 实现八大病机检测逻辑：`detectBing()` 逐项检测日主过旺、日主过弱、五行偏枯、五行缺漏、十神交战、格局破败、合绊用神、寒暖湿燥失衡，输出病名、病位、病象与严重程度（PRD 04.01 §Part 1 §1.1） — `code/backend/src/modules/bing/lib/bing-detector.ts` (new file)
5. 在 `BingService.diagnose()` 中聚合五行分析、十神标注、格局判定、合冲刑害辨病数据 — `code/backend/src/modules/bing/bing.service.ts` (new file)
6. 创建前端 API 客户端：`bingApi.diagnose()` — `code/frontend/src/services/bing-api.ts` (new file)
7. 创建 Pinia store：`useBingStore` 管理病机诊断数据 — `code/frontend/src/stores/bing.ts` (new file)
8. 创建"病机诊断总览页"：展示八大病机类型逐项检测状态、已识别病机的病名/病位/病象/严重程度（PRD 04.01 §Part 2） — `code/frontend/src/views/bing/BingDiagnosisView.vue` (new file)
9. 注册 Vue Router 路由：`/bing` → `BingDiagnosisView` — `code/frontend/src/router/index.ts` (new file)

**TCs covered by this Task**:

- TC-04.01-001 — 病机诊断总览页展示八大病机类型逐项检测状态：验证页面展示
- TC-04.01-002 — 病机诊断总览页展示已识别病机病名列表与严重程度标注：验证病机汇总
- TC-04.01-003 — 日主过旺病机标注——病名、病位、病象与严重程度：验证日主过旺检测
- TC-04.01-004 — 日主过弱病机标注——病名、病位、病象与严重程度：验证日主过弱检测
- TC-04.01-005 — 日主旺衰适中无病机判定：验证无病机情况
- TC-04.01-006 — 日主过旺有泄耗化解——严重程度为微恙：验证化解降低严重程度
- TC-04.01-007 — 日主过弱有印比生扶化解——严重程度为微恙：验证化解降低严重程度
- TC-04.01-008 — 五行偏枯病机标注——病名、病位、病象与严重程度：验证五行偏枯检测
- TC-04.01-009 — 五行缺漏病机标注——病名、病位、病象与严重程度：验证五行缺漏检测
- TC-04.01-010 — 五行分布无偏枯缺漏不构成病机：验证正常分布
- TC-04.01-011 — 五行偏枯未导致日主失衡——严重程度为微恙：验证偏枯程度
- TC-04.01-012 — 五行缺漏为日主所需之行——严重程度为重病：验证关键缺漏
- TC-04.01-013 — 十神交战病机标注——病名、病位、病象与严重程度：验证十神交战检测
- TC-04.01-014 — 十神交战有解救——严重程度为微恙：验证有解救降低严重程度
- TC-04.01-015 — 格局破败病机标注——病名、病位、病象与严重程度：验证格局破败检测
- TC-04.01-016 — 格局成格无十神与格局病机：验证成格无病机
- TC-04.01-017 — 格局破败有化解——严重程度为微恙：验证化解降低严重程度
- TC-04.01-018 — 合绊用神病机标注——病名、病位、病象与严重程度：验证合绊用神检测
- TC-04.01-019 — 合绊后用神完全失去效力——严重程度为重病：验证完全失效
- TC-04.01-020 — 合绊后用神未完全失去效力——严重程度为微恙：验证部分失效
- TC-04.01-021 — 寒暖湿燥失衡病机标注——过寒、过热、过湿、过燥：验证寒暖湿燥检测
- TC-04.01-022 — 寒暖湿燥失衡调候之神未出现——严重程度为重病：验证无调候之神
- TC-04.01-023 — 寒暖湿燥失衡调候之神出现——严重程度为微恙：验证有调候之神
- TC-04.01-024 — 无合绊用神与寒暖湿燥病机：验证无此类病机情况
- TC-04.01-025 — 无效命盘 ID 请求识病诊断返回错误：验证错误处理

**Acceptance**:

- 用户在"病机诊断总览页"（`/bing`）查看命盘病机分析，系统展示八大病机类型逐项检测状态
- 已识别病机展示病名、病位、病象与严重程度标注
- 病机诊断结果可供用神推导模块使用
- `GET /api/bing/:chartId` 端点正常响应

**Verification**:

1. 调用 `GET /api/bing/:chartId`，确认返回八大病机诊断结果
2. 在前端访问 `/bing`，确认病机诊断总览页渲染正确
3. 验证八大病机检测逻辑与 PRD 描述一致
4. 验证病机结果可传递至用神推导模块

---

## Task D-9: 用神喜忌推导与断吉凶

- **Status**: done
- **Priority**: P1
- **Module**: docs/PRD/04. 辨病与用神模块/02. 用神喜忌推导/用神喜忌推导.md, docs/PRD/04. 辨病与用神模块/03. 断吉凶/断吉凶.md
- **Work Type**: feature

**Goal**: 实现"用神喜忌页"（`/yongshen`，PRD 04.02 §Part 2）展示用神推导链与喜神忌神仇神闲神列表；实现"断吉凶页"（`/jixiong`，PRD 04.03 §Part 2）展示六维论断结果（性格/事业/财运/婚姻/健康/学业），每维度关联病机依据与用神推导。

**PRD Reference**: `docs/PRD/04. 辨病与用神模块/02. 用神喜忌推导/用神喜忌推导.md` §Part 1, §Part 2, `docs/PRD/04. 辨病与用神模块/03. 断吉凶/断吉凶.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/04. 辨病与用神模块/02. 用神喜忌推导/用神喜忌推导-flow.md` §1, `docs/TDD/04. 辨病与用神模块/03. 断吉凶/断吉凶-flow.md` §1`

**Code Paths**:

- Frontend: `code/frontend/src/views/bing/YongshenView.vue` (new file)
- Frontend: `code/frontend/src/views/bing/JiXiongView.vue` (new file)
- Backend: `code/backend/src/modules/bing/yongshen.controller.ts` (new file)
- Backend: `code/backend/src/modules/bing/yongshen.service.ts` (new file)
- Backend: `code/backend/src/modules/bing/jixiong.controller.ts` (new file)
- Backend: `code/backend/src/modules/bing/jixiong.service.ts` (new file)
- Backend: `code/backend/src/modules/bing/lib/yongshen-engine.ts` (new file)
- Backend: `code/backend/src/modules/bing/lib/jixiong-engine.ts` (new file)
- Backend: `code/backend/prisma/schema.prisma` — `YongShenJiXi` 与 `JiXiongVerdict` 模型 (new file)

**Constraints / ADR to respect**: ADR-001（时间存储 UTC）、ADR-002（软删除）、ADR-003（错误格式 RFC7807）、ADR-004（ID 自增整数）、ADR-006（鉴权 NestJS Guard）、ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 扩展 Prisma schema：添加 `YongShenJiXi` 与 `JiXiongVerdict` 模型 — `code/backend/prisma/schema.prisma` (new file)
2. 执行 Prisma 迁移 — (orchestration)
3. 实现用神推导逻辑链引擎：`deriveYongshen()` 根据病机推导用神候选并确定最有力用神（PRD 04.02 §Part 1 §1.1），`deriveXiji()` 推导喜神、忌神、仇神、闲神列表（PRD 04.02 §Part 1 §1.2） — `code/backend/src/modules/bing/lib/yongshen-engine.ts` (new file)
4. 实现 `YongshenController` 与 `YongshenService`：`GET /api/yongshen/:chartId` 端点 — `code/backend/src/modules/bing/yongshen.controller.ts` (new file)、`code/backend/src/modules/bing/yongshen.service.ts` (new file)
5. 实现六维论断推导引擎：`judgeJiXiong()` 以病药关系为主线逐维论断性格/事业/财运/婚姻/健康/学业，每维关联病机依据与用神推导（PRD 04.03 §Part 1 §1.1–1.7） — `code/backend/src/modules/bing/lib/jixiong-engine.ts` (new file)
6. 实现 `JiXiongController` 与 `JiXiongService`：`GET /api/jixiong/:chartId` 端点 — `code/backend/src/modules/bing/jixiong.controller.ts` (new file)、`code/backend/src/modules/bing/jixiong.service.ts` (new file)
7. 扩展前端 API 客户端：`bingApi.getYongshen()` 与 `bingApi.getJiXiong()` — `code/frontend/src/services/bing-api.ts` (new file)
8. 创建"用神喜忌页"：展示用神推导链、喜神/忌神/仇神/闲神列表（PRD 04.02 §Part 2） — `code/frontend/src/views/bing/YongshenView.vue` (new file)
9. 创建"断吉凶页"：展示六维论断结果，每维度关联病机依据与用神推导（PRD 04.03 §Part 2） — `code/frontend/src/views/bing/JiXiongView.vue` (new file)
10. 注册 Vue Router 路由：`/yongshen` → `YongshenView`、`/jixiong` → `JiXiongView` — `code/frontend/src/router/index.ts` (new file)

**TCs covered by this Task**:

- TC-04.02-001 — 用神推导——日主身旺以克泄耗为用神：验证用神推导逻辑
- TC-04.02-002 — 用神推导——日主身弱以生扶为用神：验证用神推导逻辑
- TC-04.02-003 — 用神推导——五行偏枯以调候为用神：验证调候用神
- TC-04.02-004 — 用神推导——五行缺漏以补缺为用神：验证补缺用神
- TC-04.02-005 — 用神推导——十神交战以化解十神为用神：验证化解用神
- TC-04.02-006 — 用神推导——格局破败以修补格局为用神：验证修补用神
- TC-04.02-007 — 用神推导——合绊用神以冲开合绊为用神：验证冲开用神
- TC-04.02-008 — 用神推导——寒暖湿燥以调候为用神：验证调候用神
- TC-04.02-009 — 用神推导——日主中和以扶抑适中为用神：验证中和用神
- TC-04.02-010 — 喜神推导——生助用神的五行与十神为喜神：验证喜神推导
- TC-04.02-011 — 忌神推导——加重病情的五行与十神为忌神：验证忌神推导
- TC-04.02-012 — 仇神推导——生助忌神的五行与十神为仇神：验证仇神推导
- TC-04.02-013 — 闲神推导——对命局影响不大的五行与十神为闲神：验证闲神推导
- TC-04.02-014 — 用神推导链标注——从何病推出何药：验证推导链展示
- TC-04.02-015 — 用神推导页展示用神与推导链：验证页面展示
- TC-04.02-016 — 喜忌仇闲五行与十神列表展示：验证列表展示
- TC-04.02-017 — 无病机时用神为扶抑适中：验证无病机情况
- TC-04.02-018 — 多病机并存时用神优先级：验证多病机推导
- TC-04.02-019 — 用神推导链完整性验证：验证推导逻辑链路
- TC-04.02-020 — 喜忌推导每项标注推导逻辑：验证推导逻辑标注
- TC-04.02-021 — 无效命盘 ID 请求用神推导返回错误：验证错误处理
- TC-04.03-001 — 六维论断总览页展示六个维度论断结果：验证页面展示
- TC-04.03-002 — 性格特质论断——日主身旺偏刚毅自主：验证性格论断
- TC-04.03-003 — 性格特质论断——日主身弱偏柔顺依赖：验证性格论断
- TC-04.03-004 — 性格特质论断——日主中和性格稳当：验证性格论断
- TC-04.03-005 — 性格特质论断——食伤为用神时性格外向善表达：验证性格论断
- TC-04.03-006 — 性格特质论断——印星为用神时性格内敛善思虑：验证性格论断
- TC-04.03-007 — 性格特质论断——结合十神喜忌综合论断：验证性格综合论断
- TC-04.03-008 — 性格特质论断病机依据与用神推导链：验证病机依据标注
- TC-04.03-009 — 事业官运论断——官杀为用神仕途通达：验证事业论断
- TC-04.03-010 — 事业官运论断——官杀为忌神仕途多舛：验证事业论断
- TC-04.03-011 — 事业官运论断——官杀有力事业平稳发展：验证事业论断
- TC-04.03-012 — 事业官运论断——官杀无力事业平淡少波澜：验证事业论断
- TC-04.03-013 — 事业官运论断病机依据标注：验证病机依据
- TC-04.03-014 — 财运论断——财星为用神财运亨通：验证财运论断
- TC-04.03-015 — 财运论断——财星为忌神因财生忧：验证财运论断
- TC-04.03-016 — 财运论断——比劫夺财财来财去：验证财运论断
- TC-04.03-017 — 财运论断——财星力量适中财运平稳：验证财运论断
- TC-04.03-018 — 财运论断病机依据标注：验证病机依据
- TC-04.03-019 — 婚姻感情论断——男命财星为用神居日支配偶得力：验证婚姻论断
- TC-04.03-020 — 婚姻感情论断——男命财星为忌神居日支婚姻不顺：验证婚姻论断
- TC-04.03-021 — 婚姻感情论断——女命官杀为用神居日支配偶得力：验证婚姻论断
- TC-04.03-022 — 婚姻感情论断——女命官杀为忌神居日支婚姻不顺：验证婚姻论断
- TC-04.03-023 — 婚姻感情论断——综合力量与位置论断婚姻：验证婚姻综合论断
- TC-04.03-024 — 婚姻感情论断病机依据与用神推导链：验证病机依据
- TC-04.03-025 — 健康寿元论断——五行缺漏所主脏腑薄弱：验证健康论断
- TC-04.03-026 — 健康寿元论断——五行偏枯克伐脏腑：验证健康论断
- TC-04.03-027 — 健康寿元论断——十神交战伤及健康：验证健康论断
- TC-04.03-028 — 健康寿元论断——命局平衡健康平稳：验证健康论断
- TC-04.03-029 — 健康寿元论断病机依据标注：验证病机依据
- TC-04.03-030 — 学业文昌论断——印星为用神且得力学业有成：验证学业论断
- TC-04.03-031 — 学业文昌论断——印星为忌神读书费力学业反复：验证学业论断
- TC-04.03-032 — 学业文昌论断——文昌入命学业有机缘：验证学业论断
- TC-04.03-033 — 学业文昌论断——印星力量适中学业平稳：验证学业论断
- TC-04.03-034 — 学业文昌论断病机依据标注：验证病机依据
- TC-04.03-035 — 无效命盘 ID 请求断吉凶返回错误：验证错误处理

**Acceptance**:

- 用户在"用神喜忌页"（`/yongshen`）查看用神推导链与喜忌仇闲列表
- 用户在"断吉凶页"（`/jixiong`）查看六维论断结果，每维度关联病机依据
- `GET /api/yongshen/:chartId` 与 `GET /api/jixiong/:chartId` 端点正常响应

**Verification**:

1. 调用 `GET /api/yongshen/:chartId`，确认返回用神与喜忌推导数据
2. 调用 `GET /api/jixiong/:chartId`，确认返回六维论断数据
3. 在前端访问 `/yongshen` 与 `/jixiong`，确认页面渲染正确
4. 验证用神推导逻辑与 PRD 描述一致
5. 验证六维论断逻辑与 PRD 描述一致

---

## Task D-10: 岁运药效评估

- **Status**: done
- **Priority**: P2
- **Module**: docs/PRD/04. 辨病与用神模块/04. 岁运药效评估/岁运药效评估.md
- **Work Type**: feature

**Goal**: 实现"岁运药效评估"功能（PRD 04.04 §Part 1），将大运与流年数据叠入命局，评估岁运对病机的影响与药效消长，输出运势时间线。本任务实现药效评估逻辑与前端展示，大运流年数据需依赖模块 06（不在本用户故事范围内），开发阶段使用桩数据。

**PRD Reference**: `docs/PRD/04. 辨病与用神模块/04. 岁运药效评估/岁运药效评估.md` §Part 1, §Part 2

**TDD Reference**: `docs/TDD/04. 辨病与用神模块/04. 岁运药效评估/岁运药效评估-flow.md` §1`

**Code Paths**:

- Frontend: `code/frontend/src/components/dayun/YaoXiaoTimeline.vue` (new file)
- Backend: `code/backend/src/modules/bing/lib/yaoxiao-evaluator.ts` (new file)

**Constraints / ADR to respect**: ADR-007（日志结构化 JSON + trace-id）

**Implementation Steps**:

1. 实现岁运药效评估逻辑：`evaluateYaoXiao()` 逐年评估大运流年对命局病机的影响，判定药到/病重/平稳状态（PRD 04.04 §Part 1 §1.1–1.3） — `code/backend/src/modules/bing/lib/yaoxiao-evaluator.ts` (new file)
2. 在 `DayunService.getDayun()` 响应中包含药效评估字段（注：`DayunService` 属于模块 06，不在本用户故事范围内；开发阶段使用桩数据，待模块 06 实现后替换） — (orchestration)
3. 创建"岁运药效时间线"组件：展示逐年药效评估结果，标注药到之年/病重之年/平稳之年（PRD 04.04 §Part 2） — `code/frontend/src/components/dayun/YaoXiaoTimeline.vue` (new file)
4. 将 `YaoXiaoTimeline` 嵌入 `/dayun` 页面（注：`DayunView` 属于模块 06，不在本用户故事范围内；开发阶段创建临时路由入口展示药效时间线）

**TCs covered by this Task**:

- TC-04.04-001 — 大运药效评估——药到大运标注病情缓解：验证药到大运识别
- TC-04.04-002 — 大运药效评估——病重大运标注病情加重：验证病重大运识别
- TC-04.04-003 — 大运药效评估——仇神助忌大运标注间接受损：验证仇神助忌识别
- TC-04.04-004 — 大运药效评估——平稳大运标注影响不大：验证平稳大运识别
- TC-04.04-005 — 大运药效评估汇总结果展示：验证大运药效汇总
- TC-04.04-006 — 流年药效评估——药到之年标注病情缓解：验证药到之年识别
- TC-04.04-007 — 流年药效评估——病重之年标注病情加重：验证病重之年识别
- TC-04.04-008 — 流年药效评估——仇神助忌之年标注间接受损：验证仇神助忌之年识别
- TC-04.04-009 — 流年药效评估——平稳之年标注影响不大：验证平稳之年识别
- TC-04.04-010 — 岁运药效综合评估——大运与流年叠加分析：验证叠加分析
- TC-04.04-011 — 岁运药效时间线展示：验证时间线渲染
- TC-04.04-012 — 用神在大运流年中得力——对应维度趋吉：验证趋吉标注
- TC-04.04-013 — 忌神在大运流年中得力——对应维度趋凶：验证趋凶标注
- TC-04.04-014 — 岁运药效评估结果输出至论断报告：验证结果传递
- TC-04.04-015 — 无大运数据时药效评估返回提示：验证桩数据场景
- TC-04.04-016 — 多大运流年叠加药效评估：验证多周期叠加
- TC-04.04-017 — 药效评估与病机诊断一致性验证：验证药效与病机关联
- TC-04.04-018 — 岁运药效评估——用神在大运中完全失去效力：验证药效衰退
- TC-04.04-019 — 岁运药效评估——用神在大运中逐渐恢复效力：验证药效恢复
- TC-04.04-020 — 岁运药效评估——忌神在大运中被合绊减轻影响：验证忌神减轻
- TC-04.04-021 — 岁运药效评估——流年与大运共同作用药效消长：验证综合评估
- TC-04.04-022 — 岁运药效时间线逐年展开详情：验证时间线详情
- TC-04.04-023 — 无效命盘 ID 请求岁运药效评估返回错误：验证错误处理

**Acceptance**:

- 系统完成用神推导后，将大运流年数据叠入命局，逐年评估药效消长
- 岁运药效时间线展示逐年药到/病重/平稳状态标注
- 开发阶段使用桩数据提供大运流年输入，待模块 06 实现后替换

**Verification**:

1. 使用桩数据模拟大运流年输入，调用药效评估逻辑，确认返回逐年药效数据
2. 在前端确认药效时间线组件渲染正确
3. 验证药效评估逻辑与 PRD 描述一致
4. 验证药效评估结果与病机诊断一致性