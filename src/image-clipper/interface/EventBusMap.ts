// 支持的事件类型
export type EventBusMap = {
	// 初始化之前
	beforeInit: () => void;
	// 初始化之后
	afterInit: () => void;

	// 图片加载完成事件
	imageLoaded: () => void;

	// 图片加载失败事件
	imageError: () => void;

	// 图片更新事件 缩放 平移 旋转 （针对返回属性即可）
	imageUpdate: () => void;

	// 裁剪框更新事件 缩放 平移 （针对返回属性即可）
	cropUpdate: () => void;

	// 预览
	preview: () => void;
};
