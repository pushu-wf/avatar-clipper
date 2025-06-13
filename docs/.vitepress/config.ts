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
				items: [{ text: "事件中心", link: "/quick-start/eventbus/" }],
			},
			{
				text: "Command",
				items: [{ text: "命令中心", link: "/quick-start/command/" }],
			},
			{
				text: "Other",
				items: [
					{ text: "其他说明", link: "/quick-start/other/" },
					{ text: "更新日志", link: "/quick-start/other/changelog" },
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/pushu-wf/avatar-clipper" }],
	},
});
