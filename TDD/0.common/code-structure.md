# 代码结构索引

> 约束见 architecture.md（裁决极性相反：本文件描述"代码在哪"、跟随代码重生成；architecture.md 规定"代码必须遵守什么"、违反=违规）。

## 1. 概述

本文档是八字论断系统的跨模块代码结构导航索引，将 PRD 模块映射到具体的前后端代码路径与数据模型。本文档为**首次生成（绿地）**，`code/` 目录尚无实现代码，所有路径均为基于技术栈约定与 PRD 功能范围的**规划路径**，待代码落地后随实现更新。

**派生快照**：`code/` 目录为空（无 git 仓库、无跟踪文件），git tracked = 0。

**技术栈**：前端 Vue 3 + Pinia + Ant Design Vue + Vue Router 4 + vue-i18n + Vite；后端 TypeScript 5 + NestJS + JWT + @nestjs/schedule；数据层 Prisma + SQLite（本地嵌入式）。

> 本文件为代码位置索引（WHERE），不规定架构规则或约束——规则由 `architecture.md` 定义。

## 2. 仓库布局

本项目为绿地阶段，`code/` 尚无仓库。根据技术栈约定，规划以下仓库结构：

```
code/
├── frontend/           # 前端仓库（Vue 3 + Vite）
│   ├── src/
│   │   ├── views/      # 页面级组件
│   │   ├── components/ # 可复用组件
│   │   ├── stores/     # Pinia 状态管理
│   │   ├── router/     # Vue Router 路由配置
│   │   ├── i18n/       # vue-i18n 国际化
│   │   ├── services/   # API 客户端模块
│   │   └── utils/      # 工具函数
│   ├── e2e/            # Playwright E2E 测试
│   └── package.json
└── backend/            # 后端仓库（NestJS + Prisma）
    ├── src/
    │   ├── modules/    # NestJS 功能模块
    │   │   └── <module-name>/
    │   │       ├── <module-name>.module.ts
    │   │       ├── <module-name>.controller.ts
    │   │       ├── <module-name>.service.ts
    │   │       └── dto/
    │   ├── common/     # 跨模块共享（guards, interceptors, filters）
    │   ├── prisma/     # Prisma 服务 & schema
    │   └── main.ts
    ├── prisma/
    │   └── schema.prisma
    ├── e2e/            # E2E 测试
    └── package.json
```

## 3. 前端路由规划

| 路由路径 | 路由名称 | 布局 | 视图/页面组件 | 需要认证 | PRD 模块 |
|----------|----------|------|---------------|----------|----------|
| `/` | `home` | 默认布局 | `code/frontend/src/views/HomeView.vue` | 否 | 通用与外壳模块 |
| `/chart` | `chart-input` | 默认布局 | `code/frontend/src/views/chart/ChartInputView.vue` | 否 | 01. 八字排盘与历法模块 |
| `/chart/result` | `chart-result` | 默认布局 | `code/frontend/src/views/chart/ChartResultView.vue` | 否 | 01. 八字排盘与历法模块 |
| `/analysis/wuxing` | `wuxing-analysis` | 默认布局 | `code/frontend/src/views/analysis/WuxingView.vue` | 否 | 02. 五行与十神分析模块 |
| `/analysis/shishen` | `shishen-labeling` | 默认布局 | `code/frontend/src/views/analysis/ShishenView.vue` | 否 | 02. 五行与十神分析模块 |
| `/analysis/geju` | `geju-xiji` | 默认布局 | `code/frontend/src/views/analysis/GejuXijiView.vue` | 否 | 02. 五行与十神分析模块 |
| `/hechong` | `hechong-analysis` | 默认布局 | `code/frontend/src/views/hechong/HechongView.vue` | 否 | 03. 合冲刑害分析模块 |
| `/bing` | `bing-diagnosis` | 默认布局 | `code/frontend/src/views/bing/BingDiagnosisView.vue` | 否 | 04. 辨病与用神模块 |
| `/yongshen` | `yongshen-xiji` | 默认布局 | `code/frontend/src/views/bing/YongshenView.vue` | 否 | 04. 辨病与用神模块 |
| `/jixiong` | `ji-xiong` | 默认布局 | `code/frontend/src/views/bing/JiXiongView.vue` | 否 | 04. 辨病与用神模块 |
| `/shensha` | `shensha-labeling` | 默认布局 | `code/frontend/src/views/shensha/ShenshaView.vue` | 否 | 05. 神煞标注模块 |
| `/dayun` | `dayun-liunian` | 默认布局 | `code/frontend/src/views/dayun/DayunView.vue` | 否 | 06. 大运流年模块 |
| `/report` | `report` | 默认布局 | `code/frontend/src/views/report/ReportView.vue` | 否 | 07. 论断报告模块 |
| `/history` | `chart-history` | 默认布局 | `code/frontend/src/views/history/HistoryView.vue` | 否 | 08. 命盘历史与比较模块 |
| `/hepan` | `hepan-analysis` | 默认布局 | `code/frontend/src/views/history/HepanView.vue` | 否 | 08. 命盘历史与比较模块 |

> 注：产品所有角色均可使用全部功能，无需特殊权限控制。JWT 认证机制留作未来扩展预留。

## 4. 后端 API 规划

| 方法 | 路径 | 处理器 | 服务 | 数据模型/表 | 认证 | PRD 模块 |
|------|------|--------|------|-------------|------|----------|
| `POST` | `/api/chart/calculate` | `ChartController.calculate()` | `ChartService` | `Chart`, `Pillar` | 否 | 01. 八字排盘与历法模块 |
| `GET` | `/api/chart/:id` | `ChartController.getChart()` | `ChartService` | `Chart`, `Pillar` | 否 | 01. 八字排盘与历法模块 |
| `GET` | `/api/calendar/lunar-solar` | `CalendarController.convert()` | `CalendarService` | — | 否 | 01. 八字排盘与历法模块 |
| `GET` | `/api/calendar/jieqi` | `CalendarController.getJieqi()` | `CalendarService` | — | 否 | 01. 八字排盘与历法模块 |
| `GET` | `/api/analysis/wuxing/:chartId` | `WuxingController.getWuxing()` | `WuxingService` | `WuxingStat` | 否 | 02. 五行与十神分析模块 |
| `GET` | `/api/analysis/wangshuai/:chartId` | `WangShuaiController.getWangShuai()` | `WangShuaiService` | `DayMasterStrength` | 否 | 02. 五行与十神分析模块 |
| `GET` | `/api/analysis/shishen/:chartId` | `ShishenController.getShishen()` | `ShishenService` | `ShishenLabel` | 否 | 02. 五行与十神分析模块 |
| `GET` | `/api/analysis/geju/:chartId` | `GejuController.getGeju()` | `GejuService` | `GejuPattern` | 否 | 02. 五行与十神分析模块 |
| `GET` | `/api/hechong/:chartId` | `HechongController.getRelations()` | `HechongService` | `HechongRelation` | 否 | 03. 合冲刑害分析模块 |
| `GET` | `/api/bing/:chartId` | `BingController.diagnose()` | `BingService` | `BingMachine` | 否 | 04. 辨病与用神模块 |
| `GET` | `/api/yongshen/:chartId` | `YongshenController.getYongshen()` | `YongshenService` | `YongShenJiXi` | 否 | 04. 辨病与用神模块 |
| `GET` | `/api/jixiong/:chartId` | `JiXiongController.getJiXiong()` | `JiXiongService` | `JiXiongVerdict` | 否 | 04. 辨病与用神模块 |
| `GET` | `/api/shensha/:chartId` | `ShenshaController.getShensha()` | `ShenshaService` | `ShenshaLabel` | 否 | 05. 神煞标注模块 |
| `GET` | `/api/shensha/config` | `ShenshaController.getConfig()` | `ShenshaService` | `ShenshaConfig` | 否 | 05. 神煞标注模块 |
| `PUT` | `/api/shensha/config/:schoolId` | `ShenshaController.updateConfig()` | `ShenshaService` | `ShenshaConfig` | 否 | 05. 神煞标注模块 |
| `GET` | `/api/dayun/:chartId` | `DayunController.getDayun()` | `DayunService` | `DaYun`, `LiuNian` | 否 | 06. 大运流年模块 |
| `GET` | `/api/dayun/:chartId/liunian` | `DayunController.getLiunian()` | `DayunService` | `LiuNian` | 否 | 06. 大运流年模块 |
| `GET` | `/api/dayun/:chartId/hechong` | `DayunController.getDayunHechong()` | `DayunService` | `DaYunHechong` | 否 | 06. 大运流年模块 |
| `POST` | `/api/report/generate` | `ReportController.generate()` | `ReportService` | `Report` | 否 | 07. 论断报告模块 |
| `GET` | `/api/report/:id/export` | `ReportController.export()` | `ReportService` | `Report` | 否 | 07. 论断报告模块 |
| `POST` | `/api/chart/save` | `ChartHistoryController.save()` | `ChartHistoryService` | `SavedChart` | 否 | 08. 命盘历史与比较模块 |
| `GET` | `/api/chart/history` | `ChartHistoryController.list()` | `ChartHistoryService` | `SavedChart` | 否 | 08. 命盘历史与比较模块 |
| `DELETE` | `/api/chart/history/:id` | `ChartHistoryController.remove()` | `ChartHistoryService` | `SavedChart` | 否 | 08. 命盘历史与比较模块 |
| `POST` | `/api/hepan/compare` | `HepanController.compare()` | `HepanService` | `HepanResult` | 否 | 08. 命盘历史与比较模块 |

## 5. 功能模块 ↔ 代码映射

### 5.1 通用与外壳模块

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 术语悬浮提示 | 各页面内嵌（无独立路由） | `code/frontend/src/components/TermTooltip.vue` | `—` | `—` |
| 多语言切换 | 各页面共享（client-only） | `code/frontend/src/components/LanguageSwitcher.vue` | `useI18nStore` (Pinia) | `—` |
| 语言回退展示 | 各页面共享（client-only） | 内嵌于 vue-i18n 配置 | `useI18nStore` (Pinia) | `—` |
| 语言偏好持久化 | 各页面共享（client-only） | 内嵌于 i18n 插件初始化 | `useI18nStore` (Pinia) | `—` |
| 移动端响应式布局 | 各页面共享（client-only） | `code/frontend/src/components/AppLayout.vue` | `—` | `—` |
| 移动端底部导航栏 | 各页面共享（client-only） | `code/frontend/src/components/MobileNavBar.vue` | `—` | `—` |
| 移动端排盘输入适配 | `/chart`（移动端变体） | `code/frontend/src/views/chart/ChartInputView.vue`（响应式分支） | `—` | `—` |
| 移动端论断阅读适配 | `/report`（移动端变体） | `code/frontend/src/views/report/ReportView.vue`（响应式分支） | `—` | `—` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 术语定义查询 | — | — | — | — | — |

> 术语定义数据来自 `0.common/glossary.md` 的术语表，前端直接打包术语 JSON，无独立后端端点。

**跨切面**

- vue-i18n 插件配置：`code/frontend/src/i18n/`
- Pinia i18n 状态管理：`code/frontend/src/stores/i18n.ts`
- 响应式断点工具：`code/frontend/src/utils/responsive.ts`
- 本模块无后端服务

### 5.2 01. 八字排盘与历法模块

#### 5.2.1 四柱排盘

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 四柱排盘输入与计算 | `/chart` | `code/frontend/src/views/chart/ChartInputView.vue` | `useChartStore` (Pinia) | `chartApi.calculate()` |
| 四柱排盘结果展示 | `/chart/result` | `code/frontend/src/views/chart/ChartResultView.vue` | `useChartStore` (Pinia) | `chartApi.getChart()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 四柱排盘计算 | `POST /api/chart/calculate` | `ChartController.calculate()` | `ChartService` | `PrismaService` | `Chart`, `Pillar` |
| 获取排盘结果 | `GET /api/chart/:id` | `ChartController.getChart()` | `ChartService` | `PrismaService` | `Chart`, `Pillar` |

**跨切面**

- 历法计算核心库：`code/backend/src/modules/chart/lib/`（天干地支推算、万年历数据）
- 早子时夜子时处理逻辑：`code/backend/src/modules/chart/lib/zhourule.ts`

#### 5.2.2 藏干与日主

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 藏干与日主展示 | `/chart/result`（内嵌） | `code/frontend/src/components/chart/ZangGanPanel.vue` | `useChartStore` (Pinia) | `chartApi.getChart()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 藏干与日主计算 | 含于 `POST /api/chart/calculate` | `ChartController.calculate()` | `ChartService` | `PrismaService` | `Chart`, `Pillar` |

**跨切面**

- 藏干推算逻辑：`code/backend/src/modules/chart/lib/zanggan.ts`

#### 5.2.3 农历与节气

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 公历农历互转 | `/chart`（排盘输入内嵌） | `code/frontend/src/components/chart/DatePicker.vue` | `—` | `calendarApi.convert()` |
| 节气交接点查询 | `/chart`（排盘输入内嵌） | `code/frontend/src/components/chart/JieqiSelector.vue` | `—` | `calendarApi.getJieqi()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 公历农历互转 | `GET /api/calendar/lunar-solar` | `CalendarController.convert()` | `CalendarService` | `—` | — |
| 节气交接点查询 | `GET /api/calendar/jieqi` | `CalendarController.getJieqi()` | `CalendarService` | `—` | — |

**跨切面**

- 农历数据库与节气计算逻辑：`code/backend/src/modules/calendar/lib/`

#### 5.2.4 纳音五行

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 纳音五行展示 | `/chart/result`（内嵌，可选显示） | `code/frontend/src/components/chart/NayinPanel.vue` | `useChartStore` (Pinia) | `chartApi.getChart()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 纳音五行计算 | 含于 `POST /api/chart/calculate` | `ChartController.calculate()` | `ChartService` | `—` | — |

**跨切面**

- 纳音五行对照表：`code/backend/src/modules/chart/lib/nayin.ts`

### 5.3 02. 五行与十神分析模块

#### 5.3.1 五行力量统计

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 五行力量统计展示 | `/analysis/wuxing` | `code/frontend/src/views/analysis/WuxingView.vue` | `useAnalysisStore` (Pinia) | `analysisApi.getWuxing()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 五行力量统计 | `GET /api/analysis/wuxing/:chartId` | `WuxingController.getWuxing()` | `WuxingService` | `PrismaService` | `WuxingStat` |

**跨切面**

- 五行旺衰加权计算逻辑：`code/backend/src/modules/analysis/lib/wuxing-calculator.ts`

#### 5.3.2 日主旺衰判定

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 日主旺衰判定展示 | `/analysis/wuxing`（内嵌） | `code/frontend/src/components/analysis/WangShuaiPanel.vue` | `useAnalysisStore` (Pinia) | `analysisApi.getWangShuai()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 日主旺衰判定 | `GET /api/analysis/wangshuai/:chartId` | `WangShuaiController.getWangShuai()` | `WangShuaiService` | `PrismaService` | `DayMasterStrength` |

**跨切面**

- 得令得地得助综合判定逻辑：`code/backend/src/modules/analysis/lib/wangshuai-judge.ts`

#### 5.3.3 十神标注

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 十神标注展示 | `/analysis/shishen` | `code/frontend/src/views/analysis/ShishenView.vue` | `useAnalysisStore` (Pinia) | `analysisApi.getShishen()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 十神标注计算 | `GET /api/analysis/shishen/:chartId` | `ShishenController.getShishen()` | `ShishenService` | `PrismaService` | `ShishenLabel` |

**跨切面**

- 十神取法核心逻辑：`code/backend/src/modules/analysis/lib/shishen-calculator.ts`

#### 5.3.4 格局判定与喜忌

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 格局判定与喜忌展示 | `/analysis/geju` | `code/frontend/src/views/analysis/GejuXijiView.vue` | `useAnalysisStore` (Pinia) | `analysisApi.getGeju()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 格局判定与喜忌 | `GET /api/analysis/geju/:chartId` | `GejuController.getGeju()` | `GejuService` | `PrismaService` | `GejuPattern` |

**跨切面**

- 格局取法与喜忌推导逻辑：`code/backend/src/modules/analysis/lib/geju-judge.ts`

### 5.4 03. 合冲刑害分析模块

#### 5.4.1 天干合化

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 天干合化识别与展示 | `/hechong`（内嵌） | `code/frontend/src/components/hechong/TianganHePanel.vue` | `useHechongStore` (Pinia) | `hechongApi.getRelations()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 天干合化识别 | 含于 `GET /api/hechong/:chartId` | `HechongController.getRelations()` | `HechongService` | `PrismaService` | `HechongRelation` |

**跨切面**

- 天干五合规则库：`code/backend/src/modules/hechong/lib/tiangan-he.ts`

#### 5.4.2 地支合局

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 地支合局识别与展示 | `/hechong`（内嵌） | `code/frontend/src/components/hechong/DizhiHePanel.vue` | `useHechongStore` (Pinia) | `hechongApi.getRelations()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 地支合局识别 | 含于 `GET /api/hechong/:chartId` | `HechongController.getRelations()` | `HechongService` | `PrismaService` | `HechongRelation` |

**跨切面**

- 地支六合三合规则库：`code/backend/src/modules/hechong/lib/dizhi-he.ts`

#### 5.4.3 冲刑害分析

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 冲刑害分析与展示 | `/hechong`（内嵌） | `code/frontend/src/components/hechong/ChongXingHaiPanel.vue` | `useHechongStore` (Pinia) | `hechongApi.getRelations()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 冲刑害识别 | 含于 `GET /api/hechong/:chartId` | `HechongController.getRelations()` | `HechongService` | `PrismaService` | `HechongRelation` |

**跨切面**

- 六冲三刑六害自刑规则库：`code/backend/src/modules/hechong/lib/chong-xing-hai.ts`

#### 5.4.4 合冲刑害辨病

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 合冲刑害辨病判定展示 | `/hechong`（内嵌） | `code/frontend/src/components/hechong/HechongBingPanel.vue` | `useHechongStore` (Pinia) | `hechongApi.getRelations()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 合冲刑害辨病 | 含于 `GET /api/hechong/:chartId`（含辨病判定字段） | `HechongController.getRelations()` | `HechongService` | `PrismaService` | `HechongRelation` |

**跨切面**

- 辨病视角判定逻辑：`code/backend/src/modules/hechong/lib/hechong-bing.ts`

### 5.5 04. 辨病与用神模块

#### 5.5.1 识病诊断

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 识病诊断展示 | `/bing` | `code/frontend/src/views/bing/BingDiagnosisView.vue` | `useBingStore` (Pinia) | `bingApi.diagnose()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 识病诊断 | `GET /api/bing/:chartId` | `BingController.diagnose()` | `BingService` | `PrismaService` | `BingMachine` |

**跨切面**

- 八大病机类型检测逻辑：`code/backend/src/modules/bing/lib/bing-detector.ts`

#### 5.5.2 用神喜忌推导

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 用神喜忌推导展示 | `/yongshen` | `code/frontend/src/views/bing/YongshenView.vue` | `useBingStore` (Pinia) | `bingApi.getYongshen()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 用神喜忌推导 | `GET /api/yongshen/:chartId` | `YongshenController.getYongshen()` | `YongshenService` | `PrismaService` | `YongShenJiXi` |

**跨切面**

- 用神推导逻辑链引擎：`code/backend/src/modules/bing/lib/yongshen-engine.ts`

#### 5.5.3 断吉凶

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 断吉凶展示（六大维度） | `/jixiong` | `code/frontend/src/views/bing/JiXiongView.vue` | `useBingStore` (Pinia) | `bingApi.getJiXiong()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 断吉凶 | `GET /api/jixiong/:chartId` | `JiXiongController.getJiXiong()` | `JiXiongService` | `PrismaService` | `JiXiongVerdict` |

**跨切面**

- 六维论断推导引擎：`code/backend/src/modules/bing/lib/jixiong-engine.ts`

#### 5.5.4 岁运药效评估

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端端点 |
|------|------|-----------|----------|---------|
| 岁运药效评估展示 | `/dayun`（内嵌药效时间线） | `code/frontend/src/components/dayun/YaoXiaoTimeline.vue` | `useBingStore` (Pinia) | `dayunApi.getDayun()` + `bingApi.getYongshen()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 岁运药效评估 | `GET /api/dayun/:chartId`（含药效评估字段） | `DayunController.getDayun()` | `DayunService` + `BingService` | `PrismaService` | `DaYun`, `LiuNian`, `YongShenJiXi` |

**跨切面**

- 岁运药效综合评估逻辑：`code/backend/src/modules/bing/lib/yaoxiao-evaluator.ts`
- 依赖大运流年模块（模块06）提供的大运流年数据

### 5.6 05. 神煞标注模块

#### 5.6.1 神煞识别与标注

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 神煞标注展示 | `/shensha` | `code/frontend/src/views/shensha/ShenshaView.vue` | `useShenshaStore` (Pinia) | `shenshaApi.getShensha()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 神煞识别与标注 | `GET /api/shensha/:chartId` | `ShenshaController.getShensha()` | `ShenshaService` | `PrismaService` | `ShenshaLabel` |

**跨切面**

- 神煞识别规则引擎：`code/backend/src/modules/shensha/lib/shensha-rules.ts`

#### 5.6.2 神煞配置管理

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 神煞配置查看与编辑 | `/shensha`（配置面板，需管理员权限预留） | `code/frontend/src/components/shensha/ShenshaConfigPanel.vue` | `useShenshaStore` (Pinia) | `shenshaApi.getConfig()` / `shenshaApi.updateConfig()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 获取神煞配置 | `GET /api/shensha/config` | `ShenshaController.getConfig()` | `ShenshaService` | `PrismaService` | `ShenshaConfig` |
| 更新神煞配置 | `PUT /api/shensha/config/:schoolId` | `ShenshaController.updateConfig()` | `ShenshaService` | `PrismaService` | `ShenshaConfig` |

**跨切面**

- 神煞配置 CRUD 逻辑：`code/backend/src/modules/shensha/lib/config-manager.ts`

### 5.7 06. 大运流年模块

#### 5.7.1 起运与大运排列

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 起运与大运排列展示 | `/dayun` | `code/frontend/src/views/dayun/DayunView.vue` | `useDayunStore` (Pinia) | `dayunApi.getDayun()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 起运与大运排列 | `GET /api/dayun/:chartId` | `DayunController.getDayun()` | `DayunService` | `PrismaService` | `DaYun`, `LiuNian` |

**跨切面**

- 大运顺逆与起运年龄计算：`code/backend/src/modules/dayun/lib/dayun-calculator.ts`

#### 5.7.2 流年排列

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 流年排列展示 | `/dayun`（内嵌流年列表） | `code/frontend/src/components/dayun/LiunianList.vue` | `useDayunStore` (Pinia) | `dayunApi.getLiunian()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 流年排列 | `GET /api/dayun/:chartId/liunian` | `DayunController.getLiunian()` | `DayunService` | `PrismaService` | `LiuNian` |

**跨切面**

- 流年天干地支推算：`code/backend/src/modules/dayun/lib/liunian-calculator.ts`

#### 5.7.3 岁运冲合刑害

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 岁运冲合刑害标注展示 | `/dayun`（内嵌冲合刑害标注） | `code/frontend/src/components/dayun/DayunHechongPanel.vue` | `useDayunStore` (Pinia) | `dayunApi.getDayunHechong()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 岁运冲合刑害 | `GET /api/dayun/:chartId/hechong` | `DayunController.getDayunHechong()` | `DayunService` | `PrismaService` | `DaYunHechong` |

**跨切面**

- 岁运与命局冲合刑害叠加分析：`code/backend/src/modules/dayun/lib/dayun-hechong.ts`
- 依赖合冲刑害模块（模块03）的合冲刑害识别逻辑

### 5.8 07. 论断报告模块

#### 5.8.1 报告章节组织

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 报告章节选择与生成 | `/report` | `code/frontend/src/views/report/ReportView.vue` | `useReportStore` (Pinia) | `reportApi.generate()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 报告生成 | `POST /api/report/generate` | `ReportController.generate()` | `ReportService` | `PrismaService` | `Report` |

**跨切面**

- 报告章节编排引擎：`code/backend/src/modules/report/lib/report-assembler.ts`
- 依赖模块 01–06 的分析输出作为报告章节数据来源

#### 5.8.2 报告导出

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 报告导出（Markdown/PDF） | `/report`（内嵌导出按钮） | `code/frontend/src/components/report/ExportButton.vue` | `useReportStore` (Pinia) | `reportApi.export()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 报告导出 | `GET /api/report/:id/export` | `ReportController.export()` | `ReportService` | `—` | `Report` |

**跨切面**

- Markdown/PDF 导出工具：`code/backend/src/modules/report/lib/exporter.ts`

### 5.9 08. 命盘历史与比较模块

#### 5.9.1 命盘保存管理

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 命盘列表查看 | `/history` | `code/frontend/src/views/history/HistoryView.vue` | `useHistoryStore` (Pinia) | `historyApi.list()` |
| 命盘保存 | `/chart/result`（保存按钮） | `code/frontend/src/components/chart/SaveChartButton.vue` | `useHistoryStore` (Pinia) | `historyApi.save()` |
| 命盘删除 | `/history`（删除操作） | `code/frontend/src/components/history/DeleteChartDialog.vue` | `useHistoryStore` (Pinia) | `historyApi.remove()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 命盘保存 | `POST /api/chart/save` | `ChartHistoryController.save()` | `ChartHistoryService` | `PrismaService` | `SavedChart` |
| 命盘列表 | `GET /api/chart/history` | `ChartHistoryController.list()` | `ChartHistoryService` | `PrismaService` | `SavedChart` |
| 命盘删除 | `DELETE /api/chart/history/:id` | `ChartHistoryController.remove()` | `ChartHistoryService` | `PrismaService` | `SavedChart` |

**跨切面**

- 本模块为唯一需要数据持久化的 CRUD 模块（命盘历史保存）

#### 5.9.2 合盘与合婚分析

**前端**

| 功能 | 路由 | 视图/组件 | 状态管理 | 前端 API 客户端 |
|------|------|-----------|----------|-----------------|
| 合盘比较分析 | `/hepan` | `code/frontend/src/views/history/HepanView.vue` | `useHistoryStore` (Pinia) | `hepanApi.compare()` |

**后端**

| 功能 | HTTP 端点 | 处理器 | 服务 | 数据访问 | 表/集合 |
|------|-----------|--------|------|----------|---------|
| 合盘与合婚分析 | `POST /api/hepan/compare` | `HepanController.compare()` | `HepanService` | `PrismaService` | `HepanResult` |

**跨切面**

- 合盘五行互补与冲克分析逻辑：`code/backend/src/modules/history/lib/hepan-analyzer.ts`
- 依赖辨病与用神模块（模块04）的病机与用神推导结果

## 6. 共享/公共代码

### 6.1 前端共享代码

- **布局组件**：`code/frontend/src/components/AppLayout.vue`（默认布局，含侧边栏导航 + 响应式断点切换）
- **移动端导航**：`code/frontend/src/components/MobileNavBar.vue`（底部标签栏导航）
- **术语悬浮提示**：`code/frontend/src/components/TermTooltip.vue`（被所有领域模块页面引用）
- **设计令牌**：Ant Design Vue 组件令牌配置（无 Tailwind / CSS Modules）
- **Pinia Store 共享类型**：`code/frontend/src/stores/types.ts`
- **API 客户端基类**：`code/frontend/src/services/api-client.ts`（Axios 实例 + 拦截器）
- **路由配置**：`code/frontend/src/router/index.ts`
- **国际化**：`code/frontend/src/i18n/index.ts`（vue-i18n 初始化）+ `code/frontend/src/i18n/locales/zh-CN.ts`（简体中文默认语言包）

### 6.2 后端共享代码

- **Prisma 服务**：`code/backend/src/prisma/prisma.service.ts`（PrismaClient 封装，NestJS Provider）
- **Prisma Schema**：`code/backend/prisma/schema.prisma`（所有数据模型集中定义）
- **JWT 认证守卫**：`code/backend/src/common/guards/jwt-auth.guard.ts`（预留，当前所有端点无需认证）
- **全局异常过滤器**：`code/backend/src/common/filters/http-exception.filter.ts`
- **全局响应拦截器**：`code/backend/src/common/interceptors/response.interceptor.ts`
- **共享 DTO 基类**：`code/backend/src/common/dto/base.dto.ts`
- **共享工具函数**：`code/backend/src/common/utils/`

### 6.3 国际化

- vue-i18n 初始化与插件配置：`code/frontend/src/i18n/index.ts`
- 默认语言包（简体中文 zh-CN）：`code/frontend/src/i18n/locales/zh-CN.ts`
- 语言回退链：zh-CN 为最终回退
- Pinia i18n 状态管理（语言偏好持久化）：`code/frontend/src/stores/i18n.ts`

### 6.4 数据模型总览

Prisma schema 集中定义于 `code/backend/prisma/schema.prisma`，规划模型如下：

| 模型名 | 用途 | 关联 PRD 模块 |
|--------|------|---------------|
| `Chart` | 八字排盘记录 | 01. 八字排盘与历法模块 |
| `Pillar` | 四柱天干地支 | 01. 八字排盘与历法模块 |
| `WuxingStat` | 五行力量统计 | 02. 五行与十神分析模块 |
| `DayMasterStrength` | 日主旺衰判定 | 02. 五行与十神分析模块 |
| `ShishenLabel` | 十神标注 | 02. 五行与十神分析模块 |
| `GejuPattern` | 格局判定与喜忌 | 02. 五行与十神分析模块 |
| `HechongRelation` | 合冲刑害关系 | 03. 合冲刑害分析模块 |
| `BingMachine` | 病机诊断 | 04. 辨病与用神模块 |
| `YongShenJiXi` | 用神喜忌 | 04. 辨病与用神模块 |
| `JiXiongVerdict` | 吉凶论断 | 04. 辨病与用神模块 |
| `ShenshaLabel` | 神煞标注 | 05. 神煞标注模块 |
| `ShenshaConfig` | 神煞配置 | 05. 神煞标注模块 |
| `DaYun` | 大运 | 06. 大运流年模块 |
| `LiuNian` | 流年 | 06. 大运流年模块 |
| `DaYunHechong` | 岁运冲合刑害 | 06. 大运流年模块 |
| `Report` | 论断报告 | 07. 论断报告模块 |
| `SavedChart` | 命盘历史记录 | 08. 命盘历史与比较模块 |
| `HepanResult` | 合盘合婚结果 | 08. 命盘历史与比较模块 |

## 7. 覆盖缺口

本节枚举所有从 PRD 派生的可达行为单元中尚未被 §3–§5 映射的条目。由于本项目为绿地阶段（`code/` 为空），**所有功能均为待实现**，以下按类型分类列出。

### 7.1 路由与页面（前端）

所有规划路由均尚未实现——前端仓库不存在，所有 §3 中的路由与视图组件为规划路径，标记为 `待实现`：

| 路由 | 视图组件 | 状态 |
|------|----------|------|
| `/` | `HomeView.vue` | 待实现 |
| `/chart` | `ChartInputView.vue` | 待实现 |
| `/chart/result` | `ChartResultView.vue` | 待实现 |
| `/analysis/wuxing` | `WuxingView.vue` | 待实现 |
| `/analysis/shishen` | `ShishenView.vue` | 待实现 |
| `/analysis/geju` | `GejuXijiView.vue` | 待实现 |
| `/hechong` | `HechongView.vue` | 待实现 |
| `/bing` | `BingDiagnosisView.vue` | 待实现 |
| `/yongshen` | `YongshenView.vue` | 待实现 |
| `/jixiong` | `JiXiongView.vue` | 待实现 |
| `/shensha` | `ShenshaView.vue` | 待实现 |
| `/dayun` | `DayunView.vue` | 待实现 |
| `/report` | `ReportView.vue` | 待实现 |
| `/history` | `HistoryView.vue` | 待实现 |
| `/hepan` | `HepanView.vue` | 待实现 |

### 7.2 客户端级会话/模式能力

| 能力 | 寄主视图 | 状态 |
|------|----------|------|
| 语言切换（写入全局 i18n store + localStorage） | 所有页面（client-only） | 待实现 |
| 语言偏好持久化（localStorage 写入） | 所有页面（client-only） | 待实现 |
| 响应式布局切换（断点检测，写入全局布局状态） | 所有页面（client-only） | 待实现 |

### 7.3 API 端点（后端）

所有规划端点均尚未实现——后端仓库不存在，所有 §4 中的端点为规划路径，标记为 `待实现`：

| 端点 | 状态 |
|------|------|
| `POST /api/chart/calculate` | 待实现 |
| `GET /api/chart/:id` | 待实现 |
| `GET /api/calendar/lunar-solar` | 待实现 |
| `GET /api/calendar/jieqi` | 待实现 |
| `GET /api/analysis/wuxing/:chartId` | 待实现 |
| `GET /api/analysis/wangshuai/:chartId` | 待实现 |
| `GET /api/analysis/shishen/:chartId` | 待实现 |
| `GET /api/analysis/geju/:chartId` | 待实现 |
| `GET /api/hechong/:chartId` | 待实现 |
| `GET /api/bing/:chartId` | 待实现 |
| `GET /api/yongshen/:chartId` | 待实现 |
| `GET /api/jixiong/:chartId` | 待实现 |
| `GET /api/shensha/:chartId` | 待实现 |
| `GET /api/shensha/config` | 待实现 |
| `PUT /api/shensha/config/:schoolId` | 待实现 |
| `GET /api/dayun/:chartId` | 待实现 |
| `GET /api/dayun/:chartId/liunian` | 待实现 |
| `GET /api/dayun/:chartId/hechong` | 待实现 |
| `POST /api/report/generate` | 待实现 |
| `GET /api/report/:id/export` | 待实现 |
| `POST /api/chart/save` | 待实现 |
| `GET /api/chart/history` | 待实现 |
| `DELETE /api/chart/history/:id` | 待实现 |
| `POST /api/hepan/compare` | 待实现 |

### 7.4 数据模型（Prisma）

所有 Prisma 模型均尚未创建——`schema.prisma` 不存在：

| 模型 | 状态 |
|------|------|
| `Chart` | 待实现 |
| `Pillar` | 待实现 |
| `WuxingStat` | 待实现 |
| `DayMasterStrength` | 待实现 |
| `ShishenLabel` | 待实现 |
| `GejuPattern` | 待实现 |
| `HechongRelation` | 待实现 |
| `BingMachine` | 待实现 |
| `YongShenJiXi` | 待实现 |
| `JiXiongVerdict` | 待实现 |
| `ShenshaLabel` | 待实现 |
| `ShenshaConfig` | 待实现 |
| `DaYun` | 待实现 |
| `LiuNian` | 待实现 |
| `DaYunHechong` | 待实现 |
| `Report` | 待实现 |
| `SavedChart` | 待实现 |
| `HepanResult` | 待实现 |

### 7.5 PRD 模块无代码实现

所有 9 个 PRD 模块（00–08）均无前端代码与后端代码实现，全部标记为 `待实现`：

| PRD 模块 | 前端代码 | 后端代码 |
|----------|----------|----------|
| 00. 通用与外壳模块 | 待实现 | 无后端（术语数据前端内嵌） |
| 01. 八字排盘与历法模块 | 待实现 | 待实现 |
| 02. 五行与十神分析模块 | 待实现 | 待实现 |
| 03. 合冲刑害分析模块 | 待实现 | 待实现 |
| 04. 辨病与用神模块 | 待实现 | 待实现 |
| 05. 神煞标注模块 | 待实现 | 待实现 |
| 06. 大运流年模块 | 待实现 | 待实现 |
| 07. 论断报告模块 | 待实现 | 待实现 |
| 08. 命盘历史与比较模块 | 待实现 | 待实现 |

### 7.6 覆盖等式校验

| 度量 | 计数 |
|------|------|
| 可达行为单元 | 42 |
| §3–§5 已映射到 PRD 功能 | 42 |
| §7 缺口（全部为待实现） | 42 |
| 已映射 + 缺口 | 42 + 42 = 84 |

> 说明：42 个可达行为单元 = 15 个路由/页面 + 3 个客户端级会话能力 + 24 个 API 端点。由于本项目为绿地阶段，所有单元均同时出现在 §3–§5（规划映射）与 §7（待实现缺口）中——规划映射确认了 PRD 功能与代码路径的对应关系，§7 则标记了所有路径均尚未落地实现。覆盖等式 `|可达行为单元| == |已映射|` 成立（42 == 42），§7 缺口记录的是实现状态而非映射缺失。