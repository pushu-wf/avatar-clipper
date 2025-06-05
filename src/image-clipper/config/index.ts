import { ImageClipperConfig } from "../interface";

interface HistoryConfig {
	maxHistoryCount: number;
}

// 历史记录配置
const historyConfig: HistoryConfig = {
	maxHistoryCount: 20,
};

// 默认的 image clipper config 配置项
const defaultImageClipperConfig: ImageClipperConfig = {
	container: "", // 容器挂载元素
	width: undefined, // 容器宽度 默认为 0 则使用 css 样式：100%
	height: undefined, // 容器高度 默认为 0 则使用 css 样式：100%
	backgroundColor: "transparent", // 容器背景颜色 默认为透明

	// 图片属性
	image: {
		src: undefined, // 图片地址
		pixelRatio: 1, // 像素比
		outputType: "png", // 裁剪生成图片的格式
		objectFit: "contain", // 图片的缩放模式
		draggable: true, // 图片是否可拖动
		zoom: true, // 图片是否可缩放
	},

	// 裁剪相关配置
	crop: {
		width: undefined, // 裁剪框宽度
		height: undefined, // 裁剪框高度
		x: undefined, // 裁剪框x轴坐标
		y: undefined, // 裁剪框y轴坐标
		draggable: true, // 裁剪框是否可拖动
		resize: true, // 裁剪框是否可缩放
		fixed: false, // 是否固定缩放比例
	},
	// 水印相关配置
	watermark: {
		text: "Image Clipper", // 水印文字
		fontSize: 20, // 水印文字样式
		gap: [50, 50], // 水印间距 [x y]
		rotate: 45, // 旋转角度
	},
};

export { historyConfig, defaultImageClipperConfig };
