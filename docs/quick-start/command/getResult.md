# getResult

<backTop />

## 描述

获取截图结果

## 用法

```ts
clipper.command.getResult(type: "string" | "blob" | "canvas", pixelRatio?:number = 1, mimeType?: "png" | "jpeg" = "png");
```

## 参数

```ts
// 类型: string(返回base64字符串) | blob(返回blob对象) | canvas(返回canvas对象)
[必传] type: "string" | "blob" | "canvas";

// 分辨率：裁剪图片的分辨率
[非必传]pixelRatio: number;

// 文件类型: 裁剪图片的格式
[非必传]mimeType: "png" | "jpeg";
```

## 返回值

```ts
string | Blob | HTMLCanvasElement;
```

## 示例

<img src='/public/logo.svg'/>
