import Konva from "konva";
import ImageClipper from "..";
import { store } from "../store";
import { Stage } from "konva/lib/Stage";
import { LayerController } from "./Layer";
import { parseContainer } from "../utils";
import { EventResponder } from "./EventResponder";
import { imageWheel } from "../event/handlers/image-wheel";

/**
 * @description 绘制类 - 实现图层控制，绘制结果导出等
 */
export class Draw {
	private stage: Stage;
	private layerController: LayerController;
	private eventResponder: EventResponder;

	constructor(private imageClipper: ImageClipper) {
		Reflect.set(window, "draw", this);

		// 获取 konva 挂载节点
		const root = parseContainer(store.getState("container"));
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

		// 给整个 stage 添加 wheel 事件，实现图片的缩放控制
		this.stage.on("wheel", imageWheel);

		// 创建图层控制器
		this.layerController = new LayerController(this);

		// 创建事件相应器
		this.eventResponder = new EventResponder(this);

		// 如果用户传递了 image src 属性，则默认初始化图片
		const src = store.getState("image")?.src;
		if (src) this.eventResponder.setImage(src);
	}

	// getter
	public getStage = () => this.stage;
	public getImageClipper = () => this.imageClipper;
	public getEventResponder = () => this.eventResponder;
	public getLayerController = () => this.layerController;
}
