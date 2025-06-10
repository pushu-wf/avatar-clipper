import { ImageClipperConfig } from "../interface";

interface ImageScaleConfig {
	scaleStep: number;
	maxScale: number;
	minScale: number;
	translateStep: number;
}

interface ShapeIDMapConfig {
	mainLayerID: string; // main layer
	backgroundRectID: string; // 背景层
	imageID: string; // 图片层
	watermarkLayerID: string; // 水印图层
	cropLayerID: string; // 裁剪层
	cropRectID: string; // 裁剪框
	cropTransformerID: string; // 形变控制器
}

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
		rotation: -45, // 旋转角度
	},
};

// 图片缩放配置
const imageScaleConfig: ImageScaleConfig = {
	scaleStep: 0.1,
	maxScale: 2,
	minScale: 0.1,
	translateStep: 10,
};

// 为了解决 stage findOne 明明不一致问题，应该统一导出图层、图片、形变控制器、裁剪框等 ID 及 name 属性
const shapeIDMapConfig: ShapeIDMapConfig = {
	mainLayerID: "mainLayer",
	backgroundRectID: "backgroundRect",
	imageID: "image",
	watermarkLayerID: "watermarkLayer",
	cropLayerID: "cropLayer",
	cropRectID: "cropRect",
	cropTransformerID: "cropTransformer",
};

export { defaultImageClipperConfig, imageScaleConfig, shapeIDMapConfig };
