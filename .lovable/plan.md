# 轻量 CMS 数据库最终方案（单作者 · 单管理员）

在上一版基础上做三处收敛：`blocks → custom_blocks` 简化为图片入口模块、新增 `navigation` 表、权限改为单管理员模式（去掉 user_roles 体系）。其余表结构不变。

## 一、最终表清单（8 张）

```text
site_settings    站点单例 + 作者信息（单行）
pages            页面：/、/research、/experiments/[slug] 等
content_types    内容类型注册：article / experiment / note / 未来新板块
posts            所有长文内容（按 type 区分，含 archived 状态）
post_sections    文章内小节（目录 / 锚点）
media            上传的图片和资源
custom_blocks    图片入口模块（简化版，不再是通用 block）
navigation       后台可编辑的导航项（顶部 / 移动端 / Footer）
```

移除：`user_roles`、`app_role` 枚举、`has_role()` 函数、原 `blocks` 通用装点位表。

## 二、字段变化

### 2.1 custom_blocks（替代原 blocks）

单一用途：图片入口卡片。**没有** `kind` / `extra` / 富文本 / 动态表单。

| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| title | text (nullable) | 卡片标题，可选 |
| image_media_id | uuid FK→media | 卡片图片 |
| link_url | text | 跳转链接（内部或外部） |
| placement | text | 显示位置标识（如 `home_bottom` / `research_side`） |
| sort_order | int | 排序 |
| is_visible | boolean | 显示开关 |
| created_at / updated_at | timestamptz | |

### 2.2 navigation（新增）

| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| location | text | `header` / `mobile` / `footer` |
| label | text | 显示文字 |
| href | text | 链接（`/research`、`#experiments`、外链皆可） |
| sort_order | int | 排序 |
| is_visible | boolean | 显示开关 |
| open_in_new_tab | boolean | 是否新窗口打开 |
| created_at / updated_at | timestamptz | |

### 2.3 其他表：保持上一版

- `site_settings`：单行，含 `author_name` / `author_name_en` / `bio_lines` / `tags` / `avatar_media_id` / `site_name` / `seo_title` / `seo_description` / `socials`。
- `posts`：`status` 枚举扩展 `draft | published | archived`。
- `content_types`：保留 `schema jsonb`，仅作为未来扩展占位，第一阶段不据此生成动态表单。
- `post_sections` / `media`：不变。
- `pages`：保留，用于挂载 `custom_blocks.placement` 的语义化位置管理。

## 三、关系图

```text
site_settings ──> media (avatar)

content_types 1──n posts 1──n post_sections
                   posts n──1 media (cover)

pages 1──n custom_blocks n──1 media
navigation  (独立表，无外键)
```

## 四、权限设计（单管理员模式）

原则：**前台完全公开读，写入仅登录管理员**。不再使用 `user_roles` / `has_role()` / SECURITY DEFINER。

管理员判定：直接在 RLS 中比对 `auth.uid()` 是否等于 `site_settings.admin_user_id`（在 `site_settings` 增加一个 `admin_user_id uuid` 字段，指向 Supabase Auth 中的唯一管理员账号；此字段只由 SQL 手动写入一次，前台不读）。

| 表 | anon SELECT | authenticated SELECT | INSERT/UPDATE/DELETE |
|---|---|---|---|
| site_settings | ✅ | ✅ | 仅 `auth.uid() = admin_user_id` |
| pages | ✅ | ✅ | 同上 |
| content_types | ✅ | ✅ | 同上 |
| posts | ✅ 仅 `status='published'` | ✅ 同 anon 规则 | 同上 |
| post_sections | ✅ 若父 post 已发布 | 同上 | 同上 |
| media | ✅ | ✅ | 同上 |
| custom_blocks | ✅ 仅 `is_visible=true` | ✅ 全部 | 同上 |
| navigation | ✅ 仅 `is_visible=true` | ✅ 全部 | 同上 |

补充：
- 每张表 `ENABLE ROW LEVEL SECURITY` + 显式 `GRANT`（anon / authenticated / service_role 按上表分配）。
- Storage `media` bucket：public read；写入策略同样 `auth.uid() = (select admin_user_id from site_settings limit 1)`。
- `service_role` 全表 `GRANT ALL`，用于后续可能的服务端脚本。

## 五、扩展点（保持）

- 新增内容板块 → `content_types` 增行 + `posts.extra jsonb` 存该类型专属字段。
- 新增导航位置 → `navigation.location` 增加取值，无需改表。
- 新增图片入口位置 → `custom_blocks.placement` 增加取值，无需改表。

## 六、说明

- 仅方案定稿，本轮不建库、不改代码。
- 确认后可据此生成一份完整迁移 SQL（含 GRANT / RLS / 触发器）供你审阅。
