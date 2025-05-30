import { ImageClipperConfig } from "./interface";
import { parseContainer } from "./utils";

class ImageClipper {
	constructor(private options: ImageClipperConfig) {
		// 1. 先解析 container
		const container = parseContainer(this.options.container);
		console.log(" ==> ", container);
	}
}

export { ImageClipper };
export default ImageClipper;

// 导出类型
export type { ImageClipperConfig };
