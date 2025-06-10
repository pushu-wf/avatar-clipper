// 此处为演示效果，核心代码在 avatar-clipper/index.ts 中
import { AvatarClipper } from "./avatar-clipper/index";

window.onload = () => {
	const clipper = new AvatarClipper({
		container: "#app .clipper",
		image: {
			src: "https://img0.baidu.com/it/u=2895902758,4240700774&fm=253&fmt=auto&app=120&f=JPEG",
		},
	});

	Reflect.set(window, "clipper", clipper);

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

	// 背景颜色
	const backgroundColorInput = <HTMLInputElement>document.querySelector("input#backgroundColor");
	backgroundColorInput?.addEventListener("change", handleBackgroundColor);

	// 图片可拖动
	const imageDraggableInput = <HTMLInputElement>document.querySelector("input#image-draggable");
	imageDraggableInput?.addEventListener("change", handleImageDraggable);

	// 图片可缩放
	const imageZoomInput = <HTMLInputElement>document.querySelector("input#image-zoom");
	imageZoomInput?.addEventListener("change", handleImageZoom);

	// 水印文本
	const watermarkTextInput = <HTMLInputElement>document.querySelector("input#watermark-text");
	watermarkTextInput?.addEventListener("change", handleWatermarkText);

	// 水印颜色
	const watermarkColorInput = <HTMLInputElement>document.querySelector("input#watermark-color");
	watermarkColorInput?.addEventListener("change", handleWatermarkColor);

	// 水印旋转
	const watermarkRotationInput = <HTMLInputElement>document.querySelector("input#watermark-rotation");
	watermarkRotationInput?.addEventListener("change", handleWatermarkRotation);

	// 水印水平间距
	const watermarkGapXInput = <HTMLInputElement>document.querySelector("input#watermark-gap-x");
	watermarkGapXInput?.addEventListener("change", handleWatermarkGap);

	// 水印垂直间距
	const watermarkGapYInput = <HTMLInputElement>document.querySelector("input#watermark-gap-y");
	watermarkGapYInput?.addEventListener("change", handleWatermarkGap);

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
	function handleClear() {
		clipper.command.clearImage();
	}

	/**
	 * @description handleReset 重置
	 */
	function handleReset() {}

	/**
	 * @description handleAmplify 放大
	 */
	function handleAmplify() {
		// 获取当前的缩放比例
		const { scaleX = 1, scaleY = 1 } = clipper.command.getImageAttrs();

		clipper.command.updateImageAttrs({ scaleX: scaleX + 0.1, scaleY: scaleY + 0.1 });
	}

	/**
	 * @description handleReduce 缩小
	 */
	function handleReduce() {
		// 获取当前的缩放比例
		const { scaleX = 1, scaleY = 1 } = clipper.command.getImageAttrs();
		clipper.command.updateImageAttrs({ scaleX: scaleX - 0.1, scaleY: scaleY - 0.1 });
	}

	/**
	 * @description handleRotation 旋转
	 */
	function handleRotation() {
		// 获取当前的旋转角度
		const { rotation = 0 } = clipper.command.getImageAttrs();
		clipper.command.updateImageAttrs({ rotation: rotation + 15 });
	}

	/**
	 * @description 背景颜色改变
	 */
	function handleBackgroundColor() {
		const backgroundColor = backgroundColorInput.value;
		clipper.command.setBackgroundColor(backgroundColor);
	}

	/**
	 * @description 图片可拖动
	 */
	function handleImageDraggable() {
		const draggable = imageDraggableInput.checked;
		clipper.command.updateImageAttrs({ draggable });
	}

	/**
	 * @description 图片可缩放
	 */
	function handleImageZoom() {
		const zoom = imageZoomInput.checked;
		clipper.command.updateImageAttrs({ zoom });
	}

	/**
	 * @description 水印文本
	 */
	function handleWatermarkText() {
		const text = watermarkTextInput.value;
		clipper.command.updateWatermarkAttrs({ text });
	}

	/**
	 * @description 水印颜色
	 */
	function handleWatermarkColor() {
		const color = watermarkColorInput.value;
		clipper.command.updateWatermarkAttrs({ color });
	}

	/**
	 * @description 水印旋转
	 */
	function handleWatermarkRotation() {
		const rotation = Number(watermarkRotationInput.value);
		clipper.command.updateWatermarkAttrs({ rotation });
	}

	/**
	 * @description 水印水平间距
	 */
	function handleWatermarkGap() {
		const gapx = Number(watermarkGapXInput.value);
		const gapy = Number(watermarkGapYInput.value);
		clipper.command.updateWatermarkAttrs({ gap: [gapx, gapy] });
	}
};
