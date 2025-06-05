import Konva from "konva";
import ImageClipper from "..";
import { parseImageSource } from "../utils";
import { EventBus } from "../event/EventBus";
import { EventBusMap } from "../interface/EventBusMap";
import { store } from "../store";

export class Draw {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	constructor(private imageClipper: ImageClipper, private event: EventBus<EventBusMap>) {
		Reflect.set(window, "draw", this);

		const root = this.imageClipper.getContainer();
		const container = root.querySelector("#image-clipper-konva-container");

		if (!container) {
			throw new Error("container is not exist");
		}

		// 确保 container 是 HTMLDivElement 类型
		if (!(container instanceof HTMLDivElement)) {
			throw new Error("container is not a HTMLDivElement");
		}

		// konva stage 的宽高与容器一致
		const { width, height } = container.getBoundingClientRect();

		// 创建 stage
		this.stage = new Konva.Stage({ container, width, height });

		// 创建 layer
		this.layer = new Konva.Layer({ id: "mainLayer" });

		// 添加到 stage 上
		this.stage.add(this.layer);

		// 添加裁剪器
		this.addCrop();

		// 添加水印
		this.addWatermark();

		// 添加暗部
		this.handleCropOuterBlur();

		// 更新视图
		this.render();
	}

	/**
	 * @description 渲染容器
	 */
	public render() {
		if (!this.stage) return;

		this.layer.batchDraw();
		this.stage.batchDraw();
	}

	/**
	 * @description 添加图片
	 * @param { string | Blob } image 图片实例
	 */
	public async addImage(image: string | Blob) {
		if (!this.stage || !this.layer) return;

		const imageClipper = this.getImageClipper();

		// 判断当前layer 下是否已经存在图片资源
		const oldImage = this.layer.findOne("#image");
		if (oldImage) oldImage.destroy();

		// 创建新的图片实例
		const imageNode = new Image();

		// 解析 source 资源
		const source = await parseImageSource(image);
		imageNode.src = source;

		// 基于 load 事件实现 konva image 创建
		imageNode.onload = () => {
			// 创建 Konva.Image
			const konvaImage = new Konva.Image({
				id: "image",
				image: imageNode,
				x: 0,
				y: 0,
				width: imageNode.width,
				height: imageNode.height,
				draggable: store.getState("image")?.draggable,
				listening: true,
			});

			this.layer.add(konvaImage);

			this.render();

			// patch image loaded event
			imageClipper.dispatchEvent("imageLoaded");
		};

		// patch image error event
		imageNode.onerror = () => imageClipper.dispatchEvent("imageError");
	}

	/**
	 * @description 添加裁剪框
	 */
	public addCrop() {
		if (!this.stage || !this.layer) return;
		// 获取裁剪框属性
		const cropAttr = store.getState("crop");
		// 获取 stage 的宽高
		const { width, height } = this.stage.size();

		// 创建裁剪框
		const crop = new Konva.Rect({
			x: 0,
			y: 0,
			width: cropAttr?.width ?? width * 0.5,
			height: cropAttr?.height ?? height * 0.5,
			strokeWidth: 0,
			fill: "transparent",
			stroke: "transparent",
			draggable: true,
			listening: true,
		});

		// 实现居中显示
		const x = cropAttr?.x ?? (width - crop.width()) / 2;
		const y = cropAttr?.y ?? (height - crop.height()) / 2;
		crop.position({ x, y });

		// 创建型变控制器
		const transformer = new Konva.Transformer({
			rotateEnabled: false,
			anchorStroke: cropAttr?.stroke ?? "#299CF5",
			anchorFill: cropAttr?.fill ?? "#299CF5",
			anchorSize: 8,
			anchorCornerRadius: 8,
			borderStroke: cropAttr?.stroke ?? "#299CF5",
			borderDash: [8, 10],
			borderStrokeWidth: 2,
		});

		// 添加到 crop 上
		transformer.nodes([crop]);
		this.layer.add(crop, transformer);

		this.render();
	}

	/**
	 * @description 添加水印
	 */
	public addWatermark() {
		if (!this.stage) return;
		// 如果存在旧的水印图层，先删除
		const oldWortermarkLayer = this.stage.findOne("#watermarkLayer");
		if (oldWortermarkLayer) oldWortermarkLayer.destroy();

		const { width, height } = this.stage.getSize();

		// text | fontSize | density | rotate
		const wortermarkAttr = store.getState("watermark");

		// 不然创建新的水印图层 - 设置不可相应事件
		const watermarkLayer = new Konva.Layer({ id: "watermarkLayer", listening: false });

		// 创建水印 - 循环创建，并将 layer 进行旋转即可
		const simpleText = new Konva.Text({
			text: wortermarkAttr?.text ?? "Simple Text",
			fontSize: wortermarkAttr?.fontSize ?? 20,
			fontFamily: "Calibri",
			fill: wortermarkAttr?.color ?? "rgba(0,0,0,.35)",
		});

		// 定义间隔
		const [gapX, gapY] = wortermarkAttr?.gap ?? [10, 10];

		// 循环创建水印
		for (let i = 0; i < width * 2; i += simpleText.width() + gapX) {
			for (let j = 0; j < height * 2; j += simpleText.height() + gapY) {
				// 判断当前是否为偶数行
				const row = Math.floor(j / (simpleText.height() + gapY));
				const isEvenRow = row % 2 === 0;
				const text = simpleText.clone();
				text.x(i + (isEvenRow ? simpleText.width() / 2 : 0));
				text.y(j);
				watermarkLayer.add(text);
			}
		}

		watermarkLayer.batchDraw();
		this.stage.add(watermarkLayer);
		this.render();
	}

	/**
	 * @description 处理裁剪框外部暗部效果
	 */
	public handleCropOuterBlur() {
		if (!this.stage) return;
		// 如果存在旧的水印图层，先删除
		const wortermarkLayer = <Konva.Layer>this.stage.findOne("#watermarkLayer");
		if (!wortermarkLayer) return;

		// 获取 stage 的宽高
		const { width, height } = this.stage.getSize();

		// 给图层添加一个 full rect
		const blurRect = new Konva.Rect({
			x: 0,
			y: 0,
			width,
			height,
			id: "blurRect",
			sceneFunc(ctx, shape) {
				/*绘画顺时针外部正方形*/
				ctx.moveTo(0, 0); // 起点
				ctx.lineTo(width, 0); // 第一条线
				ctx.lineTo(width, height); // 第二条线
				ctx.lineTo(0, height); // 第三条线
				ctx.closePath(); // 结束路径，自动闭合

				/*绘画逆时针内部正方形*/
				ctx.moveTo(300, 220); // 起点
				ctx.lineTo(300, 80); // 第一条线
				ctx.lineTo(100, 80); // 第二条线
				ctx.lineTo(100, 220); // 第三条线
				ctx.closePath(); // 结束路径，自动闭合
				/*填充颜色*/
				ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
				ctx.fill();

				ctx.fillStrokeShape(shape);
			},
		});
		// 裁剪框外模糊
		wortermarkLayer.add(blurRect);

		this.render();
	}

	// getter
	public getEvent = () => this.event;
	public getStage = () => this.stage;
	public getLayer = () => this.layer;
	public getImageClipper = () => this.imageClipper;
}
