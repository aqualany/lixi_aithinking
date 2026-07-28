# 轻量 CMS 数据库最终方案 v4（单作者 · 单管理员）

仅为方案文档。不建库、不生成 SQL、不改代码。

## 一、表清单（共 8 张）

1. `site_settings` — 站点信息 + 作者信息 + 管理员锚点（单行）
2. `pages` — 页面注册表（首页 / research / experiments / resume 等）
3. `navigation` — 顶部导航、移动端导航、Footer 链接
4. `content_types` — 内容类型注册表（研究文章 / 实验笔记 / 思考文章 / 未来扩展）
5. `posts` — 所有长文内容（统一表）
6. `post_sections` — 文章章节 / 目录 / 锚点
7. `media` — 图片与素材
8. `custom_blocks` — 简单图片入口模块（广告位 / 外链 / 推荐 / 按钮 / 图片卡片）

## 二、字段设计

### 1. site_settings（单行）
- `id` uuid PK
- `site_title` text
- `site_description` text
- `seo_keywords` text[]
- `author_name` text（聂灵晞）
- `bio_lines` text[]（Hero 简介行）
- `tags` text[]（INFJ / 写作者 等）
- `avatar_media_id` uuid FK → media
- `github_url` text
- `contact_email` text
- `admin_user_id` uuid — **唯一管理员 auth.users.id，仅通过 SQL 手动初始化**
- `created_at` / `updated_at`

### 2. pages
- `id` uuid PK
- `slug` text unique（`home` / `research` / `experiments` / `resume`）
- `title` text
- `description` text
- `is_visible` boolean
- `sort_order` int
- `created_at` / `updated_at`

### 3. navigation
- `id` uuid PK
- `location` text enum（`header` / `mobile` / `footer`）
- `label` text
- `href` text（内部 slug 或外部 URL）
- `is_external` boolean
- `sort_order` int
- `is_visible` boolean
- `created_at` / `updated_at`

### 4. content_types
- `id` uuid PK
- `slug` text unique（`research` / `experiment` / `thought` / …）
- `name` text
- `description` text
- `schema` jsonb — **仅预留，第一阶段不生成动态表单，后台不开放 JSON 编辑**
- `sort_order` int
- `created_at` / `updated_at`

### 5. posts
- `id` uuid PK
- `content_type_id` uuid FK → content_types
- `slug` text unique
- `title` text
- `subtitle` text
- `summary` text
- `cover_media_id` uuid FK → media
- `body_md` text（正文 Markdown）
- `status` text enum（`draft` / `published` / `archived`）
- `published_at` timestamptz
- `sort_order` int
- `extra` jsonb — **第一阶段仅预留，不生成后台 JSON 编辑入口**
- `created_at` / `updated_at`

### 6. post_sections
- `id` uuid PK
- `post_id` uuid FK → posts
- `anchor` text（锚点 id）
- `title` text
- `sort_order` int
- `created_at` / `updated_at`

### 7. media
- `id` uuid PK
- `storage_path` text（Supabase Storage 路径）
- `public_url` text
- `alt` text
- `width` int / `height` int
- `mime_type` text
- `created_at` / `updated_at`

### 8. custom_blocks
- `id` uuid PK
- `page_id` uuid FK → pages
- `title` text（可选）
- `image_media_id` uuid FK → media
- `link_url` text
- `placement` text（如 `top` / `sidebar` / `bottom`）
- `sort_order` int
- `is_visible` boolean
- `created_at` / `updated_at`

## 三、关系图

```text
site_settings ──▶ media (avatar_media_id)

content_types ──▶ posts ──▶ post_sections
                     │
                     └──▶ media (cover_media_id)

pages ──▶ custom_blocks ──▶ media (image_media_id)

navigation  (独立)
media       (独立资源池)
```

## 四、RLS 权限设计

原则：**前台公开读；管理员写；管理员可读全部草稿/归档**。

判定管理员：
```sql
auth.uid() = (SELECT admin_user_id FROM public.site_settings LIMIT 1)
```

### 读策略
- `site_settings` / `pages` / `navigation` / `content_types` / `media`：`anon` + `authenticated` 均可读（`is_visible` 由应用层筛选）。
- `posts`：
  - `anon`：仅 `status = 'published'`
  - `authenticated`（管理员）：可读 `draft` / `published` / `archived` 全部
- `post_sections`：
  - `anon`：仅当父 post 为 `published`
  - `authenticated`（管理员）：全部可读
- `custom_blocks`：`anon` 仅 `is_visible = true`；`authenticated` 全部。

### 写策略
所有 INSERT / UPDATE / DELETE：仅当 `auth.uid() = site_settings.admin_user_id`。

### admin_user_id 保护（trigger 方案，不使用 column-level 权限）
- 在 `site_settings` 上加 `BEFORE UPDATE` 触发器：若 `NEW.admin_user_id IS DISTINCT FROM OLD.admin_user_id`，`RAISE EXCEPTION`。
- 初始化通过 SQL 手动 `UPDATE site_settings SET admin_user_id = '<uuid>'`（在 trigger 创建之前，或临时禁用 trigger）。
- 后台 UI 不暴露该字段编辑入口。

### Storage
- 桶（如 `media`）：公开读；写入 / 更新 / 删除仅 `auth.uid() = admin_user_id`。

## 五、不做的事（明确边界）
- 不创建 `user_roles` / `app_role` / `has_role()` / SECURITY DEFINER / 多角色体系。
- `custom_blocks` 不承担页面搭建 / 富文本 / 动态类型。
- `content_types.schema` 与 `posts.extra` 第一阶段不生成动态表单或 JSON 编辑 UI。
- 后台不允许修改 `admin_user_id`（由 DB trigger 强制）。

## 六、后续
方案确认后，若需要执行，我可以：
- 输出可粘贴到你自己 Supabase SQL Editor 的完整 migration SQL（含 GRANT / RLS / trigger）；
- 之后再对接前端 CMS 页面。当前不动数据库、不改代码。
