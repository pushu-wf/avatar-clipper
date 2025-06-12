import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Avatar Clipper",
	description: "轻量级图片裁剪工具",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Docs", link: "/quick-start/" },
			{ text: "Demo", link: "/quick-start/online/" },
		],

		logo: "/logo.svg", // 表示docs/public/avartar.png
		outline: {
			label: "页面导航",
		},
		sidebar: [
			{
				text: "Introduction",
				items: [
					{ text: "什么是 Avatar Clipper?", link: "/quick-start/what-is" },
					{ text: "快速开始", link: "/quick-start/" },
				],
			},
			{
				text: "Interface",
				items: [{ text: "接口文件", link: "/quick-start/interface/" }],
			},
			{
				text: "Event",
				items: [
					{ text: "事件中心", link: "/quick-start/eventbus/" },
					// { text: "beforeInit", link: "/quick-start/eventbus/beforeInit" },
					// { text: "afterInit", link: "/quick-start/eventbus/afterInit" },
					// { text: "imageLoaded", link: "/quick-start/eventbus/imageLoaded" },
					// { text: "imageError", link: "/quick-start/eventbus/imageError" },
					// { text: "imageUpdate", link: "/quick-start/eventbus/imageUpdate" },
					// { text: "cropUpdate", link: "/quick-start/eventbus/cropUpdate" },
					// { text: "preview", link: "/quick-start/eventbus/preview" },
				],
			},
			{
				text: "命令中心",
				items: [
					{ text: "clearImage", link: "/quick-start/command/clearImage" },
					{ text: "reset", link: "/quick-start/command/reset" },
					{ text: "destroy", link: "/quick-start/command/destroy" },
					{ text: "setBackgroundColor", link: "/quick-start/command/setBackgroundColor" },
					{ text: "setImage", link: "/quick-start/command/setImage" },
					{ text: "updateImageAttrs", link: "/quick-start/command/updateImageAttrs" },
					{ text: "getImageAttrs", link: "/quick-start/command/getImageAttrs" },
					{ text: "updateCropAttrs", link: "/quick-start/command/updateCropAttrs" },
					{ text: "updateWatermarkAttrs", link: "/quick-start/command/updateWatermarkAttrs" },
					{ text: "getResult", link: "/quick-start/command/getResult" },
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
	},
});
