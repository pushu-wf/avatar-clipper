import { getDefaultConfig } from "../config";
import { AvatarClipperConfig } from "../interface";

class Store {
	private state: AvatarClipperConfig;

	constructor() {
		this.state = { ...getDefaultConfig() };
	}

	// 设置state
	public setState<T extends keyof AvatarClipperConfig>(key: T, value: AvatarClipperConfig[T]) {
		this.state[key] = value;
	}

	// 替换stage
	public replaceStage(stage: AvatarClipperConfig) {
		this.state = stage;
	}

	// 获取state
	public getState<T extends keyof AvatarClipperConfig>(key: T): AvatarClipperConfig[T] {
		return this.state[key];
	}
}

// export only the easy board store
export const store = new Store();
