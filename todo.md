# Fin-Demo 项目任务清单

## 已完成

- [x] 创建 Dify API 路由 (`/api/dify/route.ts`)
- [x] 创建交易页面 (`/src/app/[locale]/trade/page.tsx`)
- [x] 交易页面逻辑完善：根据 `referdocs/trade-page.tsx` 的内容，更新 `/trade` 页面的代码，并确保其与 Dify API 的交互功能正常。
- [x] 定义 `trade_logs` 数据库表结构
- [x] **主页改造**：根据 `referdocs/主页.tsx` 的内容，修改项目现有主页。
  - [x] 在主页添加明确的按钮或链接，使用 `next-intl` 的 `Link` 组件指向 `/trade` 页面，以确保正确的国际化路由跳转。

## 待定/后续任务

- [ ] **交易日志保存**：实现 `/api/trade-log` API，处理用户对话记录的保存（需要用户登录功能）。
- [ ] **用户认证集成**：将用户登录、注册和会话管理功能与交易页面和日志保存功能集成。