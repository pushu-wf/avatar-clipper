---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: "Avatar Clipper"
    text: ""
    tagline: 轻量级图片裁剪工具
    image:
        src: logo.svg
        alt: 背景图
    actions:
        - theme: brand
          text: 快速开始
          link: /quick-start/
        - theme: alt
          text: 在线体验
          link: /quick-start/online/

features:
    - title: TypeScript 支持
      icon: 🎉
      details: 原生支持 TypeScript，提供完整的类型定义文件

    - title: 简洁|灵活
      icon: 🚀
      details: 核心架构采用 Command 和 EventBus 模块，提供简洁 API 操作和灵活的事件回调机制

    - title: 轻量级
      icon: 🎈
      details: 在保持功能完整的同时更加轻量化，不绑定任何 UI 组件，核心库打包结果仅 200 多kb，仅通过 API 实现核心裁剪功能
---
