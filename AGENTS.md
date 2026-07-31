<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Lixi CMS — Debug 工作协议

## 项目身份

你负责维护本项目（Lixi AI Thinking CMS）。

你的目标：
不是快速修改代码，而是保证用户实际使用流程稳定。

完成标准：

代码修改 ≠ 完成

必须满足：

后台操作
→ 数据保存
→ 数据库更新
→ SSR读取
→ 前端显示
→ 刷新后保持

---

## Debug 工作协议

当用户反馈：

- 修改后台但前台没变化
- 保存后恢复旧内容
- 页面显示异常
- 图片/头像/favicon不同步

禁止直接修改代码。

必须先定位数据链路。

### 检查顺序

#### 1. UI输入
确认：用户输入值是什么？React state 是否变化？

#### 2. 保存逻辑
检查：save/update 函数 payload。确认字段是否真的提交。
例如：UI有 form.subtitle，必须检查 payload.subtitle。
禁止：只改输入框，不改保存。

#### 3. 数据库
确认：数据库字段是否存在。写入后的真实值是什么。

#### 4. SSR
确认：loader/beforeLoad 是否读取最新数据。

#### 5. 数据转换
检查：mapper 是否丢字段。

#### 6. 页面组件
确认：props 是否收到数据。

最终输出：
```
问题字段：xxx
UI:        xxx
Payload:   xxx
Database:  xxx
SSR:       xxx
Component: xxx
故障位置： xxx
```

---

## 修改规则

任何字段修改必须检查完整链路：

Database → TypeScript → Admin Form → Save Payload → Database Update → SSR Query → Mapper → Frontend

禁止只修改其中一层。

---

## React规则

禁止在组件内部定义组件。

错误：
```tsx
function Page() {
  function Input() { }
}
```
原因：会导致 input 重新 mount、输入框失焦、state 丢失。

所有 Hook 必须：组件顶层调用，不允许放 useEffect callback，不允许条件调用。

---

## CMS原则

这是个人创作者网站。

优先：简单可靠，不要过度设计。

如果需求是"让我填写一个标签"，优先方案：posts.subtitle。
不要创建 content_types、category system、mapping table。
除非用户明确要求。

---

## 保存体验要求

所有后台保存必须：
1. 显示保存中
2. 成功提示
3. 失败提示
4. 保存后重新读取验证

不能：点击保存没有反馈。

---

## 部署规则

修改代码后必须确认：git status → git diff → git commit → git push

不要出现"代码改了但是没有部署"。

如果线上没有变化，检查：commit、deployment、build artifact。不要猜缓存。

---

## 完成汇报格式

不要说"已完成"。

必须输出：
```
修改：
原因：
验证：
后台：✅
数据库：✅
SSR：✅
前台：✅
刷新：✅
Commit: xxx
```

---

## UX 自我审查模式

当用户要求检查后台体验、交互问题、可用性时：

不要只检查代码是否运行。必须以真实用户身份模拟操作。

角色：第一次使用 CMS 的内容创作者。

检查流程：
1. 登录后台
2. 修改站点配置
3. 保存
4. 刷新确认
5. 创建文章
6. 上传图片
7. 插入媒体
8. 预览文章
9. 发布内容
10. 查看前台效果

每一步检查：用户是否知道下一步做什么？是否有明确反馈？是否可能误操作？是否可能丢失内容？是否需要额外点击？是否符合创作者工作习惯？

输出格式：
```
功能：
问题：
用户影响：
严重程度：
建议方案：
```

严重程度：
- P0: 阻碍使用
- P1: 明显影响效率
- P2: 体验优化
