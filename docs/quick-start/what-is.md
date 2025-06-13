---
aside: false
---

# 什么是 Avatar Clipper?

<backTop />

        Avatar-Clipper 是一款基于 Konva 开发的轻量级头像裁剪工具，支持 TypeScript 。其核心架构采用 Command 和 EventBus 模块，提供简洁 API 操作和灵活的事件回调机制。工具支持图片加载、裁剪框交互、水印添加、暗部效果等特色功能，并能导出多种格式的裁剪结果。相比现有方案，avatar-clipper 在保持功能完整的同时更加轻量化，不绑定任何 UI 组件，核心库打包结果仅 200 多 kb，仅通过 API 实现核心裁剪功能，适用于社交媒体、电商等多场景需求。

::: tip 想先体验一下？跳到 [在线体验](/quick-start/online/)
:::

## 功能演示

<img src="/public/result.gif" alt="Avatar-Clipper" />

## 为什么要使用 Avatar-Clipper

1. 原生支持 TypeScript，提供完整的类型提示，类型定义文件已内置，无需额外安装。
2. 灵活的事件回调机制，可自定义事件处理逻辑，满足用户系统、社交媒体、电商等多场景需求。
3. 轻量级，基于 Konva 构建，不绑定任何 UI 组件，仅通过 API 实现核心裁剪功能，核心库打包结果仅 `200 多 kb`。
