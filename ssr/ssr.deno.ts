
import {
	DOMParser,
	type Element,
	type Document,
} from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

import projects from "./projects.deno.ts";

/* 
deno run --unstable --allow-net --allow-read --allow-write=. ssr.deno.ts
*/

const dom = new DOMParser().parseFromString(
	await Deno.readTextFile(new URL("./template.html", import.meta.url)),
	"text/html",
)!;

const template: Element = new DOMParser().parseFromString([
	`<div class="template">`,
	`	<li>`,
	`		<a>`,
	`			<img />`,
	`			<h3 class="title">&nbsp;</h3>`,
	`			<p class="description">&nbsp;</p>`,
	`		</a>`,
	`	</li>`,
	`</div>`,
].join("\n"), "text/html")!.querySelector(".template")!;

const cards = projects.map(() => {
	const clone: Element = (template.firstElementChild!.cloneNode(true));
	dom.querySelector(".projects ul")!.appendChild(clone);
	return clone;
});

await Promise.all(projects.map(async (project: Record<string, string>, index: number) => {
	let htmlDocument: Document;

	if (!project.image || !project.title || !project.description) {
		htmlDocument = new DOMParser().parseFromString(await (await window.fetch(
			new URL(project.url, "https://benjaminaster.com/").href,
			{ cache: "reload" },
		)).text(), "text/html")!;
	}

	const image: string = project.image ?? (() => {
		const href = htmlDocument!.querySelector("link[rel=icon]")?.getAttribute("href");
		if (!href) return;
		const base = htmlDocument!.querySelector("base")?.getAttribute("href") ?? "./";
		return new URL(href, new URL(base, new URL(project.url, "https://benjaminaster.com/"))).href;
	})();

	const title: string = project.title ?? htmlDocument!.querySelector("title")?.textContent;

	const description: string = project.description ?? htmlDocument!.querySelector("meta[name=description]")?.getAttribute("content");

	const card = cards[index];

	card.querySelector("a")!.setAttribute("href", project.url);
	card.querySelector("img")!.setAttribute("src", image);
	card.querySelector("img")!.setAttribute("alt", title);
	card.querySelector(".title")!.textContent = title;
	card.querySelector(".description")!.textContent = description;
}));

Deno.writeTextFile(new URL("../index.html", import.meta.url), "<!DOCTYPE html>\n" + dom.documentElement!.outerHTML);
