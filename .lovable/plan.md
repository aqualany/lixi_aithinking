# CMS 数据库方案 · 修订版（单作者）

仅在上一版基础上做增量调整：删除 `profile`，其字段并入 `site_settings`。其余表保留。

## 一、表清单（7 张）

```text
site_settings   站点级单例 + 作者信息（单作者合并）
pages           页面：/、/research、/experiments/[slug] 等
content_types   内容类型注册：article / experiment / note / 未来新板块
posts           所有长文内容（按 type 区分）
post_sections   文章内小节（目录、锚点）
media           上传的图片/资源
blocks          页面装点位：广告 / 外链 / 推荐 / 按钮 / 图卡 / 富文本
```

变化：**移除 `profile`**。理由：单作者站点，作者信息即站点信息，合并进 `site_settings` 更简单。

## 二、字段变化

### `site_settings`（唯一变化的表，仍为单行）

新增/合并字段（来自原 profile）：

| 字段 | 类型 | 用途 |
|---|---|---|
| author_name | text | 显示名（聂灵晞） |
| author_name_en | text | 英文名（Nie Lingxi），可空 |
| bio_lines | jsonb (text[]) | Hero 下方几行小字 |
| tags | jsonb (text[]) | INFJ / vibe-coding 等 |
| avatar_media_id | uuid FK→media | 圆形头像 |

保留原有字段：`id`, `site_name`, `seo_title`, `seo_description`, `socials (jsonb)`, `updated_at`。

其余表（`pages` / `content_types` / `posts` / `post_sections` / `media` / `blocks`）字段与上一版一致，不重复列出。

## 三、关系图

```text
site_settings ──> media (avatar)

content_types 1──n posts 1──n post_sections
                   posts n──1 media (cover)

pages 1──n blocks n──1 media
              blocks n──1 posts   (推荐位指向文章)
```

关键扩展点不变：
- 新增内容板块 → `content_types` 加一行 + `posts.extra` 存该类型字段。
- 新增展示位 → `blocks.kind` 加一个值 + `blocks.extra` 存该 kind 字段。

## 四、RLS 调整

原则不变：**读公开、写仅管理员**。使用独立 `user_roles(user_id, role app_role)` + `SECURITY DEFINER` 的 `has_role()` 函数（角色绝不存 `site_settings`）。

调整点仅一处：**移除 `profile` 的策略**，其余表策略与上一版相同。

| 表 | anon SELECT | authenticated SELECT | 写入 |
|---|---|---|---|
| site_settings | ✅ | ✅ | admin only |
| pages | ✅ | ✅ | admin only |
| content_types | ✅ | ✅ | admin only |
| posts | ✅ 仅 `status='published'` | ✅ 已发布 | admin only |
| post_sections | ✅ 若父 post 已发布 | 同上 | admin only |
| media | ✅ | ✅ | admin only |
| blocks | ✅ 仅 `is_active` 且在排期内 | ✅ 全部 | admin only |

补充（未变）：
- 每张表 `ENABLE ROW LEVEL SECURITY` + 显式 `GRANT`。
- `service_role` 全表 `GRANT ALL`。
- Storage `media` bucket：public read、admin write。

## 五、说明

- 本次仅方案修订，不建库、不改代码、不引入多人协作字段（无 `author_id` / `owner_id` / 多作者关联表）。
- 上一版 `.lovable/plan.md` 内容将在你确认后按本修订覆盖。
