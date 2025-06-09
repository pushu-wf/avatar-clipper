// 此处为演示效果，核心代码在 image-clipper/index.ts 中
import { ImageClipper } from "./image-clipper/index";

window.onload = () => {
	const clipper = new ImageClipper({
		container: "#app .clipper",
		backgroundColor: "red",
		image: {
			src: "https://img0.baidu.com/it/u=2895902758,4240700774&fm=253&fmt=auto&app=120&f=JPEG",
		},
	});

	// 定义基础的形变
	let scale = 1;

	let rotation = 0;

	// 预览的两个image
	const imageArray = document.querySelectorAll("img");
	clipper.event.on("preview", (base64) => {
		imageArray.forEach((image) => (image.src = base64));
	});

	// button#upload  上传图片
	const uploadBtn = document.querySelector("button#upload");
	uploadBtn?.addEventListener("click", handleUpload);

	// button#clear  清空图片
	const clearBtn = document.querySelector("button#clear");
	clearBtn?.addEventListener("click", handleClear);

	// button#reset  重置
	const resetBtn = document.querySelector("button#reset");
	resetBtn?.addEventListener("click", handleReset);

	// button#amplify  放大图片
	const amplifyBtn = document.querySelector("button#amplify");
	amplifyBtn?.addEventListener("click", handleAmplify);

	// button#reduce  缩小图片
	const reduceBtn = document.querySelector("button#reduce");
	reduceBtn?.addEventListener("click", handleReduce);

	// button#rotation  旋转图片
	const rotationBtn = document.querySelector("button#rotation");
	rotationBtn?.addEventListener("click", handleRotation);

	/**
	 * @description handleUpload  上传图片
	 */
	function handleUpload() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			clipper.command.setImage(file);
			input.remove();
		};
		input.click();
	}

	/**
	 * @description handleClear 清空画布
	 */
	function handleClear() {}

	/**
	 * @description handleReset 重置
	 */
	function handleReset() {}

	/**
	 * @description handleAmplify 放大
	 */
	function handleAmplify() {
		scale += 0.1;
		clipper.command.updateImageAttrs({ scaleX: scale, scaleY: scale });
	}

	/**
	 * @description handleReduce 缩小
	 */
	function handleReduce() {
		scale -= 0.1;
		clipper.command.updateImageAttrs({ scaleX: scale, scaleY: scale });
	}

	/**
	 * @description handleRotation 旋转
	 */
	function handleRotation() {
		rotation += 15;
		clipper.command.updateImageAttrs({ rotation: rotation });
	}
};
