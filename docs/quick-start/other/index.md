# 其他说明

<backTop />

## 背景图片操作指引

1. 平移 `滚轮 (上下移动)` `滚轮 + Shift (左右移动)`
2. 缩放 `滚轮 + Ctrl (放大缩小)`
3. 拖动 `拖动 (上下左右)`

## 跨域图片请求须知

```ts
// Konva Image 图片创建跨域处理
const imageElement = new Image();

// 解析 source 资源
const source = await parseImageSource(image);

// 增加跨域处理 crossOrigin = Anonymous
imageElement.crossOrigin = "Anonymous";

// 设置图片源
imageElement.src = source;
```

::: danger 注意

本实例在创建图片时，已增加跨域兼容，仅当请求的域具有允许共享请求的 Access-Control-Allow-Origin 标头时，此方法才有效。如果它不起作用，那么你必须以不同的方式配置你的服务器（它超出了 Konva 的范围），或者你可以尝试将图像存储在支持 CORS 请求的其他位置。

:::

## 自定义右键菜单

1. 相关接口 [MenuItem](/quick-start/interface/#menuitem) ;
1. 在创建容器时，将 `enableContextmenu` 设置为 `true` (默认为 `true`);
1. 如果想隐藏默认菜单，将 `hideDefaultMenus` 设置为 `true` 即可;
1. 添加自定义菜单列表 `customMenus`:

```ts
const clipper = new AvatarClipper({
	// other options
	customMenus: [
		{
			id: "zoom-in",
			name: "放大",
			icon: "iconfont icon-zu22",
			action: () => clipper.command.updateImageAttrs(xxxx),
		},
	],
});
```

::: danger 1. 菜单项的 `id` 属性不能重复，执行的事件通过 `id` 属性匹配 `action`。

```ts
menuItems.find((item) => item.id === event)?.action();
```

:::

::: danger 2. 图标支持 iconfont 及 svg 图标

```ts
function getMenuItemIcon(icon: string | undefined) {
	// 判断用户传入的图标是否为空,返回 i 占位符
	if (!icon) return "<i class='iconfont'></i>";
	// 如果直接转递的 svg 字符串，则直接返回
	if (icon.startsWith("<svg")) return icon;
	// 不然就是 i 标签
	return `<i class="${icon}"></i>`;
}
```

iconfont 请完整传递 `iconfont icon-xxx`。

svg 图标示例：

```ts
const clipper = new AvatarClipper({
	// other configs
	customMenus: [
		{
			id: "zoom-in",
			name: "放大",
			action: () => clipper.command.xxxxx,
			// [!code error]
			// 为了统一风格，不建议在 svg 内设置 fill stroke 等属性
			// [!code error]
			// 已经在 css 中设置了 	fill: currentColor;stroke: currentColor;
			icon: `
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M953.75364 ..... 64.3072z"></path>
                <path d="M688.486.....48.7936 48.6912z"></path>
            </svg>`,
		},
	],
});
```

:::
