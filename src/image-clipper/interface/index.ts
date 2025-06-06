// 导出ImageClipper配置对象
interface ImageClipperConfig {
	container: string | HTMLElement; // 容器挂载元素 [必传]
	width?: number; // 容器宽度 [非必传] [默认 100%]
	height?: number; // 容器高度 [非必传] [默认 100%]
	backgroundColor?: string; // 容器背景 [非必传] [默认 transparent]

	// 图片属性
	image?: {
		src?: string | Blob; // 图片地址 [非必传]
		pixelRatio?: number; //像素比 [非必传] [默认 1]
		outputType?: "jpeg" | "png" | "webp"; //	裁剪生成图片的格式	jpg (jpg 需要传入jpeg)	jpeg, png, webp
		// 图片如何去适应指定容器的高度与宽度
		// contain	保持原有尺寸比例。内容被缩放。 [默认]
		// fill	不保证保持原有的比例，内容拉伸填充整个内容容器。
		// cover	保持原有尺寸比例。但部分内容可能被剪切。
		objectFit?: "contain" | "cover" | "fill";
		draggable?: boolean; // 图片是否可拖动
		zoom?: boolean; // 图片是否可缩放
	};

	// 裁剪相关配置
	crop?: {
		width?: number; // 裁剪框宽度
		height?: number; // 裁剪框高度
		x?: number; // 裁剪框x轴坐标
		y?: number; // 裁剪框y轴坐标
		draggable?: boolean; // 裁剪框是否可拖动
		resize?: boolean; // 裁剪框是否可缩放
		fixed?: boolean; // 是否固定缩放比例
		fill?: string; // 裁剪框填充颜色
		stroke?: string; // 裁剪框边框颜色
	};

	// 水印相关配置
	watermark?: {
		text?: string; // 水印文字
		fontSize?: number; // 水印文字大小
		color?: string; // 水印文字颜色
		gap?: [number, number]; // 水印间距 [x y]
		rotate?: number; // 旋转角度
	};
}

// 裁剪框的位置信息
interface cropInfo {
	x: number;
	y: number;
	width: number;
	height: number;
}

// 水印属性
interface watermarkInfo {
	text?: string;
	fontSize?: number;
	color?: string;
	gap?: [number, number];
	rotate?: number;
}

export { type ImageClipperConfig, type cropInfo, type watermarkInfo };
