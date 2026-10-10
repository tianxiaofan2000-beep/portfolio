# 作品展示官网・制作与上线 SOP（标准作业流程）

> 用途：把 "从零做个人作品网站 → 发布到公网 → 日常更新" 的完整流程标准化，任何新手照此操作即可复用。
> 本次采用技术栈：HTML + Tailwind CSS（CDN）+ 原生 JavaScript，纯静态、无需后端与服务器。



***

## 一、需要准备的 "软件 / 账号" 清单



| 类别       | 软件 / 服务                                | 作用                | 是否必须             |
| -------- | -------------------------------------- | ----------------- | ---------------- |
| 网页制作     | 文本编辑器（VS Code / Sublime / 系统自带 "文本编辑"） | 编写和修改 `.html` 源文件 | ✅ 必装（推荐 VS Code） |
| 本地预览     | 浏览器（Chrome / Safari / Edge）            | 查看网页效果            | ✅                |
| 本地预览（进阶） | Node.js + `npx serve`                  | 起一个本地小服务器，预览更稳    | ⭕ 可选             |
| 上传代码     | **终端（Terminal）** 或 **GitHub Desktop**  | 把本地代码推送到 GitHub   | ✅ 二选一            |
| 版本工具     | **git**（Mac 可能需安装开发者工具）                | 代码版本管理与推送         | ✅                |
| 代码托管     | **GitHub 账号**（免费）                      | 永久保存你的网站源文件       | ✅                |
| 在线托管     | **Netlify 账号**（免费）                     | 把网站发布到公网，给公开网址    | ✅                |
| 辅助       | 豆包（AI 助手）                              | 生成 / 修改网页代码       | ⭕ 推荐             |

**流程总览：** 制作网页 → 本地预览 → 推送到 GitHub → 用 Netlify 发布 → 日常改代码自动更新。



***

## 二、阶段 1：制作网页（用什么软件？）



1. **建项目文件夹**：在电脑里建一个文件夹，如 `personal-portfolio`，里面放：

* `index.html`（首页）

* `works.html`（作品案例）

* `about.html`（关于我）

* `contact.html`（联系）

* `js/main.js`（共享脚本）

1. **写代码**：用文本编辑器打开 `.html`，引入 Tailwind CDN（`https://cdn.tailwindcss.com`）+ 配置深蓝主色 + 滚动动画（详见各文件内注释）。

2. **图片**：上线前先用占位图链接（如 `https://picsum.photos/...`），后续再换成自己的真实图片。

3. **要求**：代码带中文注释、不压缩，方便日后改文字图片。

> 新手制作方式：直接让 AI 助手（豆包）按需求生成，再把生成的文件放进这个文件夹即可。



***

## 三、阶段 2：本地预览



* **最简**：双击 `index.html` 用浏览器打开（用了在线 CDN，需联网）。

* **更稳**（起本地服务器）：



```
cd 你的项目目录/personal-portfolio
npx serve .
```

浏览器打开 `http://localhost:3000`。



***

## 四、阶段 3：上传到 GitHub（用什么软件？→ 终端 或 GitHub Desktop）

### 3.1 准备 GitHub 账号



1. 打开 [https://github.com](https://github.com) → **Sign up（注册）**（免费）→ 登录。

### 3.2 新建仓库（Repository）



1. 右上角 `+`**&#x20;→&#x20;**`New repository`

2. 仓库名填 `portfolio`；可见性选 **Public（公开）**；不勾选 README 等 → **Create repository（创建仓库）**。

### 3.3 把本地代码传上去（二选一）

**方式 A：GitHub Desktop（图形界面，新手推荐）**



1. 下载安装 [https://desktop.github.com](https://desktop.github.com) → 登录

2. **File → Add local repository** → 选择 `personal-portfolio` 文件夹

3. 填提交说明 → **Commit to main**（提交）→ **Publish repository**（发布）

**方式 B：终端（命令行）**



```
cd 你的项目目录/personal-portfolio
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的用户名/portfolio.git
git push -u origin main
```

**首次推送需要：**



* 用户名：你的 GitHub 用户名

* 密码：**不是登录密码**，用**个人访问令牌（Personal Access Token）**：

  头像 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → 勾选 `repo` → Generate → 复制 → 粘贴为密码。

**验证**：刷新 GitHub 仓库页，看到 4 个 HTML + `js` 文件夹 = 上传成功。



***

## 五、阶段 4：用 Netlify 发布上线（用什么软件？→ 浏览器操作 Netlify）



1. 打开 [https://app.netlify.com](https://app.netlify.com) → **Sign up** → 选 **Continue with GitHub** 登录。

2. 点 **Add new site → Import an existing project → GitHub** → 授权后选中 `portfolio` 仓库。

3. 部署设置保持默认：**Build command（构建命令）留空**、**Publish directory（发布目录）留空或&#x20;**`/` → **Deploy site（部署站点）**。

4. 等 30 秒，状态变 **Published（已发布）**。

5. **关键：把站点设为公开**：概览页若显示 **Private（私有）**，点 **Make public（设为公开）**；在弹窗里可顺便改网址名（如 `zhuxun-studio`），权限选 **Public（公开）** → 点 **公开**。

6. 得到正式网址：`https://你的站点名.netlify.app`，发给别人即可访问。

> 注意：Netlify 免费版会在页面底部显示 "Powered by Netlify" 徽标，属正常现象。



***

## 六、阶段 5：日常更新（改内容，几十秒自动上线）

**核心：改本地文件 → 推送到 GitHub → Netlify 自动重新部署。**



1. **改哪个文件**：



| 想改什么     | 改哪个文件          |
| -------- | -------------- |
| 名字、简介、首页 | `index.html`   |
| 作品、加项目   | `works.html`   |
| 经历、技能    | `about.html`   |
| 表单、邮箱电话  | `contact.html` |



1. 用文本编辑器改完保存（`Cmd+S`）。

2. 终端推送：



```
cd 你的项目目录/personal-portfolio
git add .
git commit -m "更新内容"
git push
```



1. 等 30 秒左右，刷新网址即可看到新内容。



***

## 七、阶段 6：备用方案与应急（防止平台失效）

**网站文件存三处，任一丢失都不慌：** 你电脑 / GitHub / Netlify。



* **Netlify 无法使用时**：直接启用 **GitHub Pages** 作为主站（无 "Powered by" 徽标、免费稳定）：

  GitHub 仓库 → **Settings → Pages** → Source 选 `Deploy from a branch` → 分支 `main`、目录 `/` → **Save** → 1 分钟后得到 `https://你的用户名.github.io/`。

* **想彻底去掉 Netlify 徽标**：改用 GitHub Pages（免费且无徽标），或升级 Netlify 付费版。

* **数据永远在**：GitHub 是你网站的 "云备份"，任何时候都能取回或重部署。



***

## 八、常见问题排查表



| 现象                                 | 原因                      | 解决                             |
| ---------------------------------- | ----------------------- | ------------------------------ |
| 推送报 `Authentication failed`        | 令牌没复制完整 / 有空格           | 重新生成令牌，完整复制无空格再粘贴              |
| 网址打不开                              | 站点是 **Private（私有）**     | 在 Netlify 概览页点 **Make public** |
| 提示 `Project name is not available` | 该网址名被占用                 | 换个可用名，如 `xxx-studio`、`xxx2026` |
| 上线后没样式 / 动效                        | Tailwind CDN 未加载 / 网络拦截 | 检查联网与浏览器控制台；必要时换构建版            |
| 徽标去不掉                              | Netlify 免费版规定           | 接受它，或改用 GitHub Pages           |



***

## 九、一句话复盘

**做（AI 生成 HTML + 文本编辑器）→ 传（终端 git push 到 GitHub）→ 发（Netlify 导入仓库并设为公开）→ 更（改文件再 push，自动上线）。** 全程免费、无服务器、无数据库。