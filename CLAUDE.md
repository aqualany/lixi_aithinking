# Lixi AI Thinking

个人 AI 思考与作品集网站。

目标：
展示 AI 研究、实验记录、个人作品和内容资产。

## 技术架构

TanStack Start + React + TypeScript + Supabase + Tailwind。

核心：
- 前台作品集
- 后台 CMS
- Supabase 数据管理
- TipTap 文章编辑

## 修改原则

- 修改前先理解现有数据流。
- 不随意改变整体架构。
- 数据库修改先检查 migration。
- UI 修改保持现有设计语言。
- 优先小范围修改，不做无必要重构。

## 当前注意事项

- __root.tsx 全局数据加载较集中。
- Supabase client 存在多种创建方式。
- 文章系统存在 HTML / Markdown 双渲染逻辑。
- 类型安全部分需要逐步完善。

不要一次性重构，优先解决当前需求。