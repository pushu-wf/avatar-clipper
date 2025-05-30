// 导出ImageClipper配置对象
interface ImageClipperConfig {
	container: string | HTMLElement; // 裁剪框挂载元素 [必传]
	width: number; //剪裁框的宽度 [必传]
	height: number; // 剪裁框的高度 [必传]

	backgroundColor?: string; // 剪裁框的背景色 [非必传] [默认 transparent]
	borderColor?: string; // 剪裁框的边框颜色 [非必传] [默认 null]
}

export { type ImageClipperConfig };
