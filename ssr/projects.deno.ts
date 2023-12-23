
/* 
cd ssr
deno run --unstable --allow-net --allow-read --allow-write=.. ./ssr.deno.ts
*/

const projects: Record<string, string>[] = [
	{
		url: "/triangle-pattern/",
	},
	{
		url: "/ray-tracer/",
	},
	{
		url: "/pamm/",
	},
	{
		url: "/webindex/",
	},
	{
		url: "/web-features/",
	},
	{
		url: "https://www.npmjs.com/package/better-typescript",
		image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
		title: "Better TypeScript",
		description: "Various TypeScript type definitions to make working with TypeScript more convenient.",
		repository: "https://github.com/BenjaminAster/Better-TypeScript",
	},
	{
		url: "/css-canvas/",
	},
	{
		url: "/reflexive-view-source/",
		title: "Reflexive view-source",
		image: "/reflexive-view-source/assets/icon.svg",
	},
	{
		url: "/css-minecraft/",
	},
	{
		url: "/2d-css-minecraft/",
	},
	{
		url: "/pattern-generator/",
	},
	{
		url: "https://www.npmjs.com/package/new-javascript",
		image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
		title: "TypeScript types for new JavaScript",
		description: "TypeScript type declarations for JavaScript stuff that isn't in TypeScript's standard type declarations.",
		repository: "https://github.com/BenjaminAster/TypeScript-types-for-new-JavaScript",
	},
	{
		url: "https://github.com/BenjaminAster/Brave-Talk-Bamboozler#readme",
		image: "https://benjaminaster.github.io/Brave-Talk-Bamboozler/assets/icon.svg",
		title: "Brave Talk Bamboozler",
		description: "A Chrome extension that tricks Brave Talk into thinking you're using Brave.",
		repository: "https://github.com/BenjaminAster/Brave-Talk-Bamboozler",
	},
	{
		url: "/webgpu-mandelbrot/",
	},
	{
		url: "/icons/",
	},
	{
		url: "/geoquiz/",
	},
	{
		url: "/editor/",
	},
	{
		url: "/svg2image/",
	},
	{
		url: "/notepad/",
	},
	{
		url: "/watertyper/",
	},
	{
		url: "/colors/",
	},
	{
		url: "/clock/",
	},
	{
		url: "/tiny-snake/",
		image: "/tiny-snake/icon.svg",
		title: "Tiny Snake",
		description: "A snake game in less than 400 characters of HTML & JavaScript.",
		repository: "https://github.com/BenjaminAster/Tiny-Snake",
	},
	{
		url: "/unicode/",
	},
	{
		url: "/3d-css-calculator/",
	},
	{
		url: "/memorize-pi-digits/",
	},
	{
		url: "/browser/",
	},
	{
		url: "https://ars.electronica.art/keplersgardens/en/robdiloclock/",
		image: "https://ars.electronica.art/prix/files/2021/08/robdiloclock.jpg",
		title: "Robdilo'clock",
		description: "A robot that grasps individual segments and positions them in such a way that they display the time in digital numerals."
	},
	{
		url: "/html-entities/",
	},
	{
		url: "/copy-quizlet/",
	},
	{
		url: "/yt-ad-to-link/",
	},
	{
		url: "/2048/",
	},
	{
		url: "/game-of-life/",
	},
	{
		url: "https://ars.electronica.art/outofthebox/en/plottegoino/",
		image: "https://ars.electronica.art/outofthebox/files/2019/08/plotter@benjaminaster.jpg",
		title: "Plottegoino",
		description: "An Arduino-controlled Lego plotter that can print any desired letters."
	},
	{
		url: "/mandelbrot/",
	},
	{
		url: "/translate/",
	},
	{
		url: "/tetris/",
	},
	{
		url: "/domino-builder/",
	},
	{
		url: "/pascal-triangle/",
	},
	{
		url: "/take-away-triangles/",
	},
	{
		url: "/anaglyph-cube/",
	},
	{
		url: "/self-loading-html/",
	},
	{
		url: "/unblock-me/",
	},
	{
		url: "/youtube-thumbnail/",
	},
];

export default projects;
