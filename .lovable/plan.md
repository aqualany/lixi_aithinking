# 轻量 CMS 数据库方案（外部 Supabase）

面向当前站点（Hero / 研究长文 / 实验笔记 / 简历 / 页面装饰位）设计。原则：**少而正交** —— 用少量通用表覆盖"结构化内容 + 自由板块 + 页面装点"三类需求，避免每加一种展示位就建一张表。

## 一、表清单（8 张）

```text
site_settings      站点级单例：站名、SEO、头像、社交链接
profile            作者信息：姓名、简介、tag 列表（对应 Hero）
pages              页面：/、/research、/experiments/[slug] 等
content_types      内容类型注册：article / experiment / 未来新增板块
posts              所有长文内容（研究长文、实验笔记、未来新板块）
post_sections      文章内小节（副标题锚点、目录）
media              上传的图片/资源
blocks             页面上的"块":广告位、外链、推荐、按钮、图卡、富文本…
```

---

## 二、字段设计

### 1. `site_settings`（单行）
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | 固定一行 |
| site_name | text | 站点名 |
| author_name | text | 显示名（聂灵晞） |
| avatar_media_id | uuid FK→media | 头像 |
| seo_title / seo_description | text | 默认 SEO |
| socials | jsonb | `[{label, url}]` GitHub/邮箱等 |
| updated_at | timestamptz | |

### 2. `profile`（Hero 区）
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| display_name | text | 聂灵晞 |
| bio_lines | jsonb (text[]) | Hero 下方几行小字 |
| tags | jsonb (text[]) | INFJ / vibe-coding 等 |
| avatar_media_id | uuid FK→media | 圆形头像 |
| updated_at | timestamptz | |

> 与 site_settings 分开：一个是"站"、一个是"人"，未来若做多作者只需扩这张。

### 3. `content_types`（可扩展的关键）
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| slug | text unique | `article` / `experiment` / 未来 `note` |
| label | text | 中文名"研究长文" |
| schema | jsonb | 该类型专属字段定义（如实验笔记的 hypothesis / optimization / self_training） |
| list_page_path | text | 列在哪个页面下 |

> 新增板块不建表，只在这里加一行 + 在 `posts.extra` 存对应字段。

### 4. `posts`（所有文章的统一表）
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| type_id | uuid FK→content_types | 决定它是长文还是实验笔记 |
| slug | text unique | 路由 slug |
| title | text | |
| subtitle | text | |
| excerpt | text | 卡片/列表摘要 |
| cover_media_id | uuid FK→media | 封面 |
| body_md | text | 正文（Markdown） |
| extra | jsonb | 该 type 特有的结构化字段（如 hypothesis、optimization 步骤、self_training） |
| status | text | draft / published |
| published_at | timestamptz | 排序、目录 |
| sort_order | int | 手动置顶时用 |
| seo_title / seo_description | text | 覆盖默认 |
| created_at / updated_at | timestamptz | |

### 5. `post_sections`（文章内目录）
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| post_id | uuid FK→posts (cascade) | |
| anchor | text | `#intro` |
| title | text | 侧栏显示的副标题 |
| order_index | int | 目录顺序 |

> 也可用正文里的 H2 自动解析，但独立表更利于后台编辑与锚点跳转。

### 6. `media`
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| storage_path | text | Supabase Storage key |
| public_url | text | |
| alt | text | 无障碍 / SEO |
| width / height | int | |
| mime | text | |
| created_at | timestamptz | |

### 7. `blocks`（广告位 / 外链 / 推荐 / 按钮 / 图卡 …）
一张表统吃所有"页面装点位"。
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| page_id | uuid FK→pages (nullable) | 挂在哪个页面 |
| slot | text | `home_top` / `home_side` / `research_footer`（约定命名） |
| kind | text | `ad` / `link` / `recommendation` / `button` / `image_card` / `richtext` |
| title | text | |
| body | text | 可选说明 / 富文本 |
| media_id | uuid FK→media | 图卡/广告图 |
| href | text | 外链目标 |
| cta_label | text | 按钮文案 |
| target_post_id | uuid FK→posts | "推荐内容"直接指向站内文章 |
| extra | jsonb | kind 专属字段（如广告的 utm、按钮的 variant） |
| order_index | int | 同 slot 内排序 |
| is_active | bool | 一键上下线 |
| starts_at / ends_at | timestamptz | 广告排期，可空 |

> 新增一种展示物（如"引用卡"）→ 只加一个 `kind` 值，不建表。

### 8. `pages`
| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| path | text unique | `/` `/research` … |
| title | text | |
| seo_title / seo_description | text | |
| updated_at | timestamptz | |

---

## 三、关系图

```text
site_settings ─┐
               ├──> media
profile ───────┘

content_types 1──n posts 1──n post_sections
                   posts n──1 media (cover)

pages 1──n blocks n──1 media
              blocks n──1 posts   (推荐位指向文章)
```

关键点：`content_types + posts.extra` 让新增内容板块无需迁移；`blocks.kind + extra` 让新增展示位无需迁移。

---

## 四、RLS 建议

统一原则：**读公开、写仅管理员**。使用 `user_roles` + `has_role()` 的标准模式（不要把角色存 profile）。

| 表 | anon SELECT | authenticated SELECT | 写入 |
|---|---|---|---|
| site_settings | ✅ | ✅ | admin only |
| profile | ✅ | ✅ | admin only |
| pages | ✅ | ✅ | admin only |
| content_types | ✅ | ✅ | admin only |
| posts | ✅ 仅 `status='published'` | ✅ 已发布 + 自己的草稿 | admin only |
| post_sections | ✅ 若父 post 已发布 | 同上 | admin only |
| media | ✅ | ✅ | admin only |
| blocks | ✅ 仅 `is_active` 且在排期内 | ✅ 全部 | admin only |

补充：
- 每张表 `ENABLE ROW LEVEL SECURITY` + 显式 `GRANT SELECT ON ... TO anon, authenticated`；写权限只 `GRANT` 给 `authenticated`，具体是否放行由 policy 中 `has_role(auth.uid(),'admin')` 决定。
- `service_role` 全表 `GRANT ALL`（后台脚本 / 迁移用）。
- Storage bucket `media` 设 public read、仅 admin write。
- 单独一张 `user_roles(user_id, role app_role)` + `SECURITY DEFINER` 函数 `has_role`，避免递归 RLS。

---

## 五、为什么这样够用又可扩展

1. **少表**：8 张覆盖内容、页面、装点位、媒体、权限。
2. **两个"注册表"扛住扩展**：`content_types` 扩内容板块，`blocks.kind` 扩展示位——都靠加一行 + `jsonb`，不迁移。
3. **前台读取直接**：主页 = `profile` + `pages['/'].blocks` + `posts` 列表按 type 过滤；文章页 = `posts` + `post_sections`。
4. **长期维护简单**：所有可编辑文案/图片都在 `site_settings / profile / pages / blocks / posts` 里，后台是通用 CRUD，不需要为每种新板块开发新表单结构（表单由 `content_types.schema` / `blocks.kind` 驱动）。

本次仅为方案，不建库、不改代码；确认后再进入建表迁移阶段。