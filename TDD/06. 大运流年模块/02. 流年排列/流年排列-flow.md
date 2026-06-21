# 流年排列

> PRD Reference: docs/PRD/06. 大运流年模块/02. 流年排列/流年排列.md#流年排列

## 1. 业务流程

### 1.1 流年排列主流程

**触发**：用户在大运排列页（`/dayun`）查看流年天干地支列表。

**步骤**：

1. 用户进入大运排列页，前端从 `useDayunStore` 读取当前 `chartId`。
2. 前端调用 `dayunApi.getLiunian()` 发送 `GET /api/dayun/:chartId/liunian` 请求（可传 `startYear` 与 `endYear` 查询参数）。
3. 后端 `DayunController.getLiunian()` 接收请求，`DayunService.getLiunian()` 执行流年排列计算：
   - 调用 `generateLiunianList()` 根据出生年份与查询年份范围，按六十甲子顺序推排每年流年天干地支。
   - 调用 `calculateXuAge()` 计算每个流年的虚岁年龄（公历年份 - 出生年份 + 1）。
   - 关联每个流年到其所属大运柱序号。
4. 流年排列结果写入 `LiuNian` 数据表。
5. 前端 `LiunianList.vue` 展示流年天干地支列表。

**预期结果**：用户可查看当年及未来若干年的流年天干地支列表，包含公历年份、虚岁年龄与所属大运。

```mermaid
graph TD
    A["用户进入大运排列页<br/>查看流年列表"] --> B["dayunApi.getLiunian<br/>GET /api/dayun/:chartId/liunian"]
    B --> C["DayunService.getLiunian<br/>读取命盘与大运数据"]
    C --> D{"命盘是否存在"}
    D -->|"否"| E["返回 404"]
    D -->|"是"| F{"大运数据是否存在"}
    F -->|"否"| G["返回 422<br/>大运尚未计算"]
    F -->|"是"| H["generateLiunianList<br/>按六十甲子顺序推排流年"]
    H --> I["calculateXuAge<br/>计算每年虚岁年龄"]
    I --> J["关联大运柱序号<br/>确定流年所属大运"]
    J --> K["保存 LiuNian 记录"]
    K --> L["LiunianList.vue<br/>展示流年天干地支列表"]
```

### 1.2 流年天干地支推排流程

**触发**：系统根据出生年份与当前年份确定流年推排范围后，逐柱推排流年天干地支。

**步骤**：

1. 系统读取命盘出生年份（从 Chart 数据获取）。
2. 确定推排起始年份：默认为当前年份。
3. 确定推排终止年份：默认为起始年份 + 20 年（可通过查询参数调整）。
4. 调用 `generateLiunianList()` 按六十甲子顺序逐年推排：
   - 从出生年份的干支起，依次推排每年天干地支。
   - 天干按甲→乙→丙→丁→戊→己→庚→辛→壬→癸顺序循环。
   - 地支按子→丑→寅→卯→辰→巳→午→未→申→酉→戌→亥顺序循环。
5. 为每个流年标注五行属性（天干五行、地支五行）。
6. 返回流年天干地支列表。

**预期结果**：流年天干地支按六十甲子顺序正确推排，每年与公历年份一一对应。

```mermaid
graph TD
    A["系统读取出生年份<br/>与查询年份范围"] --> B["确定推排起始年份<br/>默认当前年份"]
    B --> C["确定推排终止年份<br/>默认起始年份+20"]
    C --> D["按六十甲子顺序<br/>逐年推排天干地支"]
    D --> E["为每个流年标注<br/>天干五行与地支五行"]
    E --> F["返回流年天干地支列表"]
```

### 1.3 虚岁计算与所属大运关联流程

**触发**：流年天干地支推排完成后，系统计算虚岁年龄并关联所属大运柱。

**步骤**：

1. 调用 `calculateXuAge()` 对每个流年计算虚岁年龄：虚岁 = 公历年份 - 出生年份 + 1。
2. 读取大运排列数据（`DaYun.dayunList`）。
3. 对每个流年，根据其虚岁年龄匹配大运柱序号：虚岁年龄落在大运柱的 `[startAge, endAge]` 区间内即属于该大运柱。
4. 将 `dayunIndex` 字段写入每个流年记录。
5. 返回带虚岁年龄与大运柱序号的流年列表。

**预期结果**：每个流年均标注了虚岁年龄与所属大运柱序号。

```mermaid
graph TD
    A["系统计算每个流年<br/>的虚岁年龄"] --> B["虚岁 = 公历年份<br/>- 出生年份 + 1"]
    B --> C["读取大运排列数据<br/>DaYun.dayunList"]
    C --> D["根据虚岁匹配<br/>大运柱起止年龄区间"]
    D --> E["写入流年所属<br/>大运柱序号"]
    E --> F["返回带虚岁年龄<br/>与大运柱序号的流年列表"]
```

## 2. 关键函数设计

### 2.1 DayunService.getLiunian

```typescript
function getLiunian(chartId: number, startYear?: number, endYear?: number): LiunianResult
```

- **职责**：根据命盘出生年份与查询年份范围计算流年排列，返回流年天干地支列表。
- **核心逻辑**：
  1. 通过 `chartId` 查询 `Chart` 数据，验证命盘存在性。
  2. 查询 `DaYun` 数据，验证大运已计算。
  3. 调用 `generateLiunianList()` 生成流年天干地支列表。
  4. 调用 `calculateXuAge()` 计算虚岁年龄。
  5. 关联每个流年到其所属大运柱。
  6. 保存 `LiuNian` 记录至数据库。
  7. 返回流年排列结果。
- **PRD 追溯**：查看当年流年天干地支、查看未来若干年流年天干地支列表、按年份范围筛选流年天干地支 — FR-06

### 2.2 generateLiunianList

```typescript
function generateLiunianList(birthYear: number, startYear: number, endYear: number): LiunianItem[]
```

- **职责**：按六十甲子顺序从出生年份起逐年推排流年天干地支。
- **核心逻辑**：
  1. 根据出生年份确定出生年的天干地支（六十甲子循环）。
  2. 从出生年份起按顺序推排天干（甲→乙→...→癸→甲循环）与地支（子→丑→...→亥→子循环）。
  3. 在查询年份范围 `[startYear, endYear]` 内截取。
  4. 为每个流年标注天干五行与地支五行属性。
  5. 返回流年天干地支列表。
- **PRD 追溯**：查看流年天干地支列表、查看流年天干地支的五行属性 — FR-06

### 2.3 calculateXuAge

```typescript
function calculateXuAge(birthYear: number, currentYear: number): number
```

- **职责**：计算流年的虚岁年龄。
- **核心逻辑**：
  1. 虚岁年龄 = 当前公历年份 - 出生公历年份 + 1。
  2. 返回虚岁年龄。
- **PRD 追溯**：查看流年虚岁年龄 — FR-06

## 3. 组件架构

```mermaid
graph TD
    A["DayunView.vue<br/>大运排列页"] --> B["dayunApi.getLiunian<br/>GET /api/dayun/:chartId/liunian"]
    B --> C["DayunController.getLiunian"]
    C --> D["DayunService.getLiunian<br/>读取命盘与大运数据"]
    D --> E["generateLiunianList<br/>按六十甲子顺序推排流年"]
    E --> F["calculateXuAge<br/>计算虚岁年龄"]
    F --> G["关联大运柱序号<br/>确定流年所属大运"]
    G --> H["PrismaService<br/>LiuNian"]
    D --> I["流年天干地支<br/>推算逻辑<br/>liunian-calculator.ts"]
    E --> I
    A --> J["LiunianList.vue<br/>流年列表组件"]
```

## 4. 数据来源

- 流年天干地支推算逻辑：`code/backend/src/modules/dayun/lib/liunian-calculator.ts`
- 四柱天干地支数据与出生年份：通过 `chartId` 引用模块 01 的 `Chart` 与 `Pillar` 表
- 大运排列数据：通过 `chartId` 引用本模块的 `DaYun` 表（流年需关联所属大运柱）
- 术语定义：`0.common/glossary.md`（流年、虚岁、六十甲子等术语）