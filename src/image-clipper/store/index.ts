import { ImageClipperConfig } from "../interface";
import { defaultImageClipperConfig } from "../config";

class Store {
	private state: ImageClipperConfig;
	constructor() {
		this.state = { ...defaultImageClipperConfig };
	}

	// 设置state
	public setState<T extends keyof ImageClipperConfig>(key: T, value: ImageClipperConfig[T]) {
		this.state[key] = value;
	}

	// 替换stage
	public replaceStage(stage: ImageClipperConfig) {
		this.state = stage;
	}

	// 获取state
	public getState<T extends keyof ImageClipperConfig>(key: T): ImageClipperConfig[T] {
		return this.state[key];
	}
}

// export only the easy board store
export const store = new Store();
