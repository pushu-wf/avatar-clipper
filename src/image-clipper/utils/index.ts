/**
 * @description 解析 container
 */
function parseContainer(container: string | HTMLElement) {
	if (typeof container === "string") {
		const dom = document.querySelector(container);
		if (!dom) {
			throw new Error(`${container} is not exist`);
		}
		return dom;
	}

	return container;
}

export { parseContainer };
