// 此处为演示效果，核心代码在 image-clipper/index.ts 中
import { ImageClipper } from "./image-clipper/index";

const clipper = new ImageClipper({
	container: "#app .clipper",
	image: {
		src: "https://img0.baidu.com/it/u=2895902758,4240700774&fm=253&fmt=auto&app=120&f=JPEG",
	},
});
const imageArray = <NodeListOf<HTMLImageElement>>document.querySelectorAll(".image-list img");
Reflect.set(window, "clipper", clipper);

clipper.event.on("preview", (base64: string) => {
	// 设置图片资源
	imageArray.forEach((item) => {
		item.src = base64;
	});
});

console.log(" ==> ", clipper);
