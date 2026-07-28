# 轻量 CMS 数据库最终方案 v3（单作者 · 单管理员）

在上一版基础上做三处微调：`custom_blocks` 增加 `page_id`、`content_types.schema` 明确为预留字段、`admin_user_id` 明确只由 SQL 初始化。本轮**不建库、不生成 SQL、不改代码**。

## 一、表清单（8 张，不变）

```text
site_settings    站点单例 + 作者信息 + admin_user_id
pages            页面：/、/research、/experiments/[slug] 等
navigation       后台可编辑的导航项（顶部 / 移动端 / Footer）
content_types    内容类型注册（schema 预留，第一阶段不使用）
posts            所有长文内容（draft / published / archived）
post_sections    文章内小节（目录 / 锚点）
media            上传的图片和资源
custom_blocks    图片入口模块（隶属于某个 page）
```

## 二、本轮字段变化

### 2.1 custom_blocks（增加 page_id）

用途仍限定为：**简单图片入口卡片**。不承担页面搭建、富文本、动态类型职责。

| 字段 | 类型 | 用途 |
|---|---|---|
| id | uuid PK | |
| page_id | uuid FK → pages | 所属页面 |
| title | text (nullable) | 卡片标题，可选 |
| image_media_id | uuid FK → media | 卡片图片 |
| link_url | text | 跳转链接（内部或外部） |
| placement | text | 页面内位置（如 `bottom` / `sidebar` / `hero`） |
| sort_order | int | 同一 (page_id, placement) 内排序 |
| is_visible | boolean | 显示开关 |
| created_at / updated_at | timestamptz | |

组合示例：
- `page_id = 首页, placement = bottom`
- `page_id = research, placement = sidebar`

明确不引入：`kind` / `extra` / 动态 block 类型 / 富文本 / 页面搭建。

### 2.2 content_types.schema（说明补充，字段不变）

| 字段 | 说明 |
|---|---|
| schema | jsonb，**仅为未来扩展预留**。第一阶段不据此生成动态表单，后台仅用通用字段编辑，不开放 JSON 直接编辑界面。 |

### 2.3 site_settings.admin_user_id（说明补充，字段不变）

- 类型：`uuid`，指向 Supabase Auth 中的唯一管理员。
- **只在初始化数据库时通过 SQL 手动写入一次**。
- CMS 后台**不提供**修改 `admin_user_id` 的入口；对应 UPDATE 策略需在写入策略中显式排除该列（迁移阶段再落实，通过触发器或 column-level 处理）。

## 三、关系图

```text
site_settings ──> media (avatar)
site_settings.admin_user_id ──> auth.users (逻辑指向，不建 FK)

content_types 1──n posts 1──n post_sections
                   posts n──1 media (cover)

pages 1──n custom_blocks n──1 media
navigation  (独立表，无外键)
```

## 四、权限设计（单管理员，不变）

原则：**前台完全公开读，写入仅登录管理员**。不使用 `user_roles` / `app_role` / `has_role()` / `SECURITY DEFINER` / 多角色体系。

管理员判定统一使用：
```
auth.uid() = (SELECT admin_user_id FROM public.site_settings LIMIT 1)
```

| 表 | anon SELECT | authenticated SELECT | 写入 |
|---|---|---|---|
| site_settings | ✅ | ✅ | 仅管理员，且禁止修改 `admin_user_id` |
| pages | ✅ | ✅ | 仅管理员 |
| navigation | ✅ 仅 `is_visible` | ✅ 全部 | 仅管理员 |
| content_types | ✅ | ✅ | 仅管理员 |
| posts | ✅ 仅 `status='published'` | ✅ 同 anon | 仅管理员 |
| post_sections | ✅ 若父 post 已发布 | 同上 | 仅管理员 |
| media | ✅ | ✅ | 仅管理员 |
| custom_blocks | ✅ 仅 `is_visible` | ✅ 全部 | 仅管理员 |

补充：
- 每张 public 表均 `ENABLE ROW LEVEL SECURITY` + 显式 `GRANT`（anon / authenticated / service_role 按上表分配）。
- Storage `media` bucket：public read；写入策略同为 `auth.uid() = site_settings.admin_user_id`。
- `service_role` 全表 `GRANT ALL`。

## 五、扩展点（不变）

- 新增内容板块 → `content_types` 增行 + `posts.extra jsonb` 存该类型专属字段。
- 新增导航位置 → `navigation.location` 增取值。
- 新增图片入口位置 → `custom_blocks.placement` 增取值 / 或新增 `pages` 行。

## 六、说明

- 本轮仅方案定稿 v3，不建库、不生成 SQL、不改代码。
- 由于本项目连接的是外部 Supabase（非 Lovable Cloud），后续迁移 SQL 需你在自己的 Supabase SQL Editor 中执行。
