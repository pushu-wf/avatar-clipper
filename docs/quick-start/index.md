# 快速开始

<backTop />

## 在线尝试

可以直接在 [StackBlitz](https://stackblitz.com/~/github.com/pushu-wf/avatar-clipper) 上进行在线尝试。
::: warning ⚠️ 温馨提示
如果打开后卡在 依赖下载 部分，请自行执行 `pnpm i` 命令，等待下载完成后，执行 `pnpm dev` 命令即可查看效果。
:::

## npm 使用

```bash
npm install avatar-clipper

# pnpm add avatar-clipper

# yarn add avatar-clipper
```

```js
import { AvatarClipper } from "avatar-clipper";

const clipper = new AvatarClipper({ container: "#app" });
```

::: warning 温馨提示
容器自身不设置宽高，请在外层自行设置
:::

## 浏览器使用

```js
// 使用 ES Module 实现 avatar-clipper 的引入
<script type="module">
    import AvatarClipper from "https://unpkg.com/avatar-clipper";
    const clipper = new AvatarClipper({
        container: "#app",
    });
</script>

```

## 源码构建

```bash
## 克隆仓库
git clone https://gitee.com/wfeng0/avatar-clipper
# git clone https://github.com/pushu-wf/avatar-clipper

## 下载依赖
npm install # or pnpm i

## 启动项目
npm run dev # or pnpm dev
```

::: warning 温馨提示
**Node.js（^18.18.0、^20.9.0 或 >=21.1.0）**

项目使用了 Eslint 语法检查工具，因此对 node 的最低版本是有要求的哈~
:::
