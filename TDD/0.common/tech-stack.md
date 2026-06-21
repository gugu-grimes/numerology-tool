# 技术栈

## 1. 前端

- **框架**: Vue 3 (Composition API + SFC)
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **样式**: Ant Design Vue
- **构建**: Vite
- **包管理器 + 锁文件**: npm + package-lock.json
- **Node 版本**: 20.x
- **国际化**: vue-i18n

## 2. 后端

- **语言 + 版本**: TypeScript 5 + Node.js 20.x
- **框架**: NestJS
- **路由约定**: NestJS controller + @Get/@Post decorator
- **服务层约定**: Service 类放 src/services/，DI 注入
- **认证**: JWT (stateless token-based)
- **CLI 工具**: NestJS CLI (@nestjs/cli)
- **定时任务**: @nestjs/schedule

## 3. 数据访问

- **ORM**: Prisma
- **数据库**: SQLite
- **迁移**: Prisma Migrate (schema-first, versioned)
- **部署**: Local file (单文件嵌入式)

## 4. 测试

- **后端单元**: Jest (NestJS default)
- **前端单元**: Vitest
- **E2E**: Playwright
- **E2E 脚本目录**: `code/<sub-dir>/e2e/`

## 5. 构建 + 部署

- **容器**: 无 (local dev only)
- **构建产物**:
  - 前端: `dist/`
  - 后端: `dist/` (NestJS build output)
- **环境**: dev only (本地开发机)
- **NFR / 质量场景 / 部署拓扑详情**: → 见 `architecture.md §5`（NFR）/ `§9`（部署拓扑）。本文件只放构建产物 + env shape，**不放** NFR 指标主张。

## 6. CI/CD 模式

- **模式**: 待声明 (run `/opera:cicd-setup` to configure)
- **配置文件**: 待创建
- **触发分支**: 待配置

## 7. 原型对齐（Prototype Alignment）

- **原型来源**: 无
- **原型栈**: N/A
- **是否对齐原型栈**: N/A
- **样式系统**: plain (Ant Design Vue component tokens)