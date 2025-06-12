import { ImageAttrs } from ".";

// 支持的事件类型
export type EventBusMap = {
	// 初始化之后
	afterInit: (result: string) => void;

	// 图片加载完成事件 - 需要获取参数初始化页面数据,例如缩放比例,旋转角度等
	imageLoaded: (imageAttrs: ImageAttrs) => void;

	// 图片加载失败事件
	imageError: (error: string | Event) => void;

	// 图片更新事件 缩放 平移 旋转 （针对返回属性即可）
	imageUpdate: (imageAttrs: ImageAttrs) => void;

	// 裁剪框更新事件 缩放 平移 （针对返回属性即可）
	// cropUpdate: (cropAttrs: AllowUpdateCropAttrs) => void;

	// 预览
	preview: (base64: string) => void;
};
