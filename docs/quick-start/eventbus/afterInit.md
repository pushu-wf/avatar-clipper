# afterInit

<backTop />

## 描述

Avatar Clipper 初始化完成后执行，可用于获取第一次截图结果，以初始化图片地址。

::: warning 温馨提示
afterInit 仅执行一次,且执行之后，command 才可用！
:::

## 用法

```ts
clipper.event.on("afterInit", (result: string) => {});
```

## 示例

<img src='/public/afterInit-image-error.png'/>
<img src='/public/afterInit-image-success.png'/>
