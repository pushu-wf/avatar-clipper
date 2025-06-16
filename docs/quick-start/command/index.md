# 命令中心

<backTop />

## 命令一览表

| 命令                                          |      说明      |                                           返回值 |
| --------------------------------------------- | :------------: | -----------------------------------------------: |
| [clearImage](#clearimage)                     |    清空图片    |                                               无 |
| [reset](#reset)                               |    重置组件    |                                               无 |
| [destroy](#destroy)                           |    销毁组件    |                                               无 |
| [getImageAttrs](#getimageattrs)               |  获取图片属性  | [ImageAttrs](/quick-start/interface/#imageattrs) |
| [getResult](#getresult)                       |  获取截图结果  |              string \| Blob \| HTMLCanvasElement |
| [updateClipperOptions](#updateclipperoptions) |   更新配置项   |                                               无 |
| [setImage](#setimage)                         |    设置图片    |                                               无 |
| [updateCropAttrs](#updatecropattrs)           | 更新裁剪框属性 |                                               无 |
| [updateImageAttrs](#updateimageattrs)         |  更新图片属性  |                                               无 |
| [updateWatermarkAttrs](#updatewatermarkattrs) |  更新水印属性  |                                               无 |

## clearImage

-   描述

清空图片

-   用法

```ts
clipper.command.clearImage();
```

-   示例

<img src='/public/clear-image.gif'/>

## reset

-   描述

重置组件（会清空图片、重置裁剪框属性、水印属性等）

-   用法

```ts
clipper.command.reset();
```

-   示例

<img src='/public/reset.gif'/>

## destroy

-   描述

销毁组件

-   用法

```ts
clipper.command.destroy();
```

-   示例

<img src='/public/destroy.gif'/>

## getImageAttrs

-   描述

获取图片属性

-   用法

```ts
clipper.command.getImageAttrs();
```

-   返回值

    -   [ImageAttrs](/quick-start/interface/#imageattrs)

-   示例

<img src='/public/getImageAttrs.gif'/>

## getResult

-   描述

获取截图结果

-   用法

```ts
clipper.command.getResult(type, pixelRatio?, mimeType?);
```

-   参数

```ts
// 类型: string(返回base64字符串) | blob(返回blob对象) | canvas(返回canvas对象)
[必传] type: "string" | "blob" | "canvas";

// 分辨率：裁剪图片的分辨率
[非必传] pixelRatio: number = 1;

// 文件类型: 裁剪图片的格式
[非必传] mimeType: "png" | "jpeg" = "png";
```

-   返回值

```ts
string | Blob | HTMLCanvasElement;
```

-   示例

<img src='/public/getResult.gif'/>

## updateClipperOptions

-   描述

设置背景颜色

-   用法

```ts
clipper.command.updateClipperOptions(options:AllowUpdateClipperOptions);
```

-   参数

[AllowUpdateClipperOptions](/quick-start/interface/#allowupdateclipperoptions)

-   示例

<img src='/public/updateClipperOptions.gif'/>

## setImage

-   描述

设置图片

-   用法

```ts
clipper.command.setImage(image: string | Blob);
```

-   参数

```ts
image: string | Blob;
```

-   示例

<img src='/public/setImage.gif'/>

## updateCropAttrs

-   描述

更新裁剪框属性

-   用法

```ts
clipper.command.updateCropAttrs(payload: AllowUpdateCropAttrs);
```

-   参数

    -   [AllowUpdateCropAttrs](/quick-start/interface/#allowupdatecropattrs)

-   示例

<img src='/public/updateCropAttrs.gif'/>

## updateImageAttrs

-   描述

更新图片属性

-   用法

```ts
clipper.command.updateImageAttrs(payload: AllowUpdateImageAttrs);
```

-   参数

    -   [AllowUpdateImageAttrs](/quick-start/interface/#allowupdateimageattrs)

-   示例

<img src='/public/updateImageAttrs.gif'/>

## updateWatermarkAttrs

-   描述

更新水印属性

-   用法

```ts
clipper.command.updateWatermarkAttrs(payload: AllowUpdateWatermarkAttrs);
```

-   参数

    -   [AllowUpdateWatermarkAttrs](/quick-start/interface/#allowupdatewatermarkattrs)

-   示例

<img src='/public/updateWatermark.gif'/>
