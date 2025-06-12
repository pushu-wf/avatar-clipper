# 事件中心

<backTop />

## 事件一览表

| 事件名                      |       说明       |                 返回值 |
| --------------------------- | :--------------: | ---------------------: |
| [afterInit](#afterinit)     |  容器初始化完成  | 初始化完成时的裁剪结果 |
| [imageLoaded](#imageloaded) | 设置图片加载完成 |               图片属性 |
| [imageError](#imageerror)   | 图片设置失败回调 |               失败原因 |
| [imageUpdate](#imageupdate) |   图片更新回调   |               图片属性 |
| [preview](#preview)         |     实时预览     |       预览结果(string) |

## afterInit

-   描述

Avatar Clipper 初始化完成后执行，可用于获取第一次截图结果，以初始化图片地址。

-   用法

```ts
clipper.event.on("afterInit", (result: string) => {});
```

-   示例

<img src='/public/afterInit-image-error.png'/>
<img src='/public/afterInit-image-success.png'/>

## imageLoaded

-   描述

图片加载完成，可获取图片初始数据。

::: tip 提示
图片加载完成后，图片数据已初始化完成，此时可进行图片操作，使用场景如下：

1️⃣ 获取图片初始化后的缩放比例，以实现 command 丝滑缩放效果；

2️⃣ 获取图片初始化后的图片位置，以实现 command 丝滑移动效果；

:::

::: warning 温馨提示
`imageLoaded` 当且仅当图片加载完成后执行，为了实时获取更新的图片信息，建议使用 `imageUpdate` 事件代替。
每一次 `imageLoaded` 事件被触发，也会同步触发 `imageUpdate` 事件。
:::

::: details ✅️ 用法示例：

```ts
/**
 * 定义图片的基础属性,用于后期变换使用
 */
const imageAttrs = { scaleX: 1, scaleY: 1, rotation: 0 };

// 监听  imageLoaded 事件,初始化图片参数
// [!code error]
clipper.event.on("imageLoaded", (attrs) => {
	// [!code error]
	imageAttrs.scaleX = attrs.scaleX!;
	// [!code error]
	imageAttrs.scaleY = attrs.scaleY!;
	// [!code error]
	imageAttrs.rotation = attrs.rotation!;
	// [!code error]
});
// [!code error]
// ⚠️ 请注意：如果使用 imageLoaded 事件，则手动缩放图片时，imageAttrs的缩放比例不会变化，需要自行维护。

// [!code ++]
// 建议使用 imageUpdate 事件
// [!code ++]
clipper.event.on("imageUpdate", (attrs) => {
	// [!code ++]
	imageAttrs.scaleX = attrs.scaleX!;
	// [!code ++]
	imageAttrs.scaleY = attrs.scaleY!;
	// [!code ++]
	imageAttrs.rotation = attrs.rotation!;
	// [!code ++]
});
/** 缩小图片 **/
function reduce() {
	clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX - scaleStep, scaleY: imageAttrs.scaleY - scaleStep });
}

/** 放大图片 **/
function enlarge() {
	clipper.command.updateImageAttrs({ scaleX: imageAttrs.scaleX + scaleStep, scaleY: imageAttrs.scaleY + scaleStep });
}
```

:::

-   用法

```ts
clipper.event.on("imageLoaded", (imageAttrs: ImageAttrs) => {});
```

-   返回值

    -   [ImageAttrs](/quick-start/interface/#imageattrs)

-   示例

<img src='/public/image-loaded-result.gif'/>

## imageError

-   描述

图片加载异常

-   用法

```ts
clipper.event.on("imageError", (error: string | Event) => {});
```

-   返回值

```
string | Event
```

-   示例

<img src='/public/image-error.png'/>

## imageUpdate

<backTop />

-   描述

图片更新事件（拖拽|缩放|旋转|设置图片源|...）

-   用法

```ts
clipper.event.on("imageUpdate", (imageAttrs: ImageAttrs) => {});
```

-   返回值

    -   [ImageAttrs](/quick-start/interface/#imageattrs)

-   示例

<img src='/public/image-update-result.gif'/>

## preview

<backTop />

-   描述

获取实时预览图片信息

-   用法

```ts
clipper.event.on("preview", (result: string) => {});
```

-   示例

<img src='/public/preview.gif'/>
