// 此处为演示效果，核心代码在 image-clipper/index.ts 中
import { ImageClipper } from "./image-clipper/index";

const clipper = new ImageClipper({
	container: "#app",
	width: 400,
	height: 300,
});

clipper.event.on("beforeInit", () => {
	console.log("hooks: beforeInit");
});

console.log(" ==> ", clipper);
