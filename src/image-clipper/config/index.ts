import { ImageClipperConfig } from "../interface";

interface HistoryConfig {
	maxHistoryCount: number;
}

interface CanvasConfig {
	scaleStep: number;
	maxScale: number;
	minScale: number;
}

// 历史记录配置
const historyConfig: HistoryConfig = {
	maxHistoryCount: 20,
};

// 默认的 image clipper config 配置项
const defaultImageClipperConfig: ImageClipperConfig = {
	container: "", // 容器挂载元素
	backgroundColor: "transparent", // 容器背景颜色 默认为透明

	// 图片属性
	image: {
		objectFit: "contain", // 图片的缩放模式
		draggable: true, // 图片是否可拖动
		zoom: true, // 图片是否可缩放
	},

	// 裁剪相关配置
	crop: {
		draggable: true, // 裁剪框是否可拖动
		resize: true, // 裁剪框是否可缩放
		fixed: false, // 是否固定缩放比例
	},
	// 水印相关配置
	watermark: {
		text: "Image Clipper", // 水印文字
		fontSize: 20, // 水印文字样式
		color: "rgba(0,0,0,.35)",
		gap: [20, 50], // 水印间距 [x y]
		rotate: -45, // 旋转角度
	},
};

// 画布配置
const canvasConfig: CanvasConfig = {
	scaleStep: 0.2,
	maxScale: 2,
	minScale: 0.1,
};

export { historyConfig, defaultImageClipperConfig, canvasConfig };
