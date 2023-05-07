
/// <reference lib="DOM" />
/// <reference lib="DOM.Iterable" />
/// <reference types="deno-types" />
/// <reference types="better-typescript" />

import { DOMParser } from "./domparser";

import projects from "./projects.deno.ts";

/* 
cd ssr
deno run --unstable --allow-net --allow-read --allow-write=.. ./ssr.deno.ts
*/

const document = new DOMParser().parseFromString(
	await Deno.readTextFile(new URL("./template.html", import.meta.url)),
	"text/html",
)!;

// const template: Element = new DOMParser().parseFromString([
// 	`<div class="template">`,
// 	`	<li>`,
// 	`		<a class="project-link">`,
// 	`			<img />`,
// 	`			<h3 class="title">&nbsp;</h3>`,
// 	`			<p class="description">&nbsp;</p>`,
// 	`		</a>`,
// 	`		<a class="repository" title="View on GitHub" href></a>`,
// 	`	</li>`,
// 	`</div>`,
// ].join("\n"), "text/html")!.querySelector(".template")!;

const template = document.querySelector(".projects > ul > template");

// console.log(template, template.firstElementChild, template.content);

const cards = projects.map(() => {
	const clone: Element = (template.cloneNode(true) as HTMLTemplateElement).content.firstElementChild;
	document.querySelector(".projects ul")!.appendChild(clone);
	return clone;
});

await Promise.all(projects.map(async (project: Record<string, string>, index: number) => {
	let htmlDocument: Document = undefined!;

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

	const repository: string = project.repository ?? htmlDocument?.querySelector("meta[name=repository]")?.getAttribute("content");

	const description: string = project.description ?? htmlDocument!.querySelector("meta[name=description]")?.getAttribute("content");

	const card = cards[index];

	if (repository) {
		card.querySelector(".repository")!.setAttribute("href", repository);
	} else {
		card.querySelector(".repository")!.remove();
	}

	card.querySelector("a")!.setAttribute("href", project.url);
	card.querySelector("img")!.setAttribute("src", image);
	card.querySelector("img")!.setAttribute("alt", `icon of ${title}`);
	card.querySelector(".title")!.textContent = title;
	card.querySelector(".description")!.textContent = description;
}));

Deno.writeTextFile(new URL("../index.html", import.meta.url), "<!DOCTYPE html>\n" + document.documentElement!.outerHTML);

/* 

https://picsum.photos/1600/900.webp
https://source.unsplash.com/random/1600x900/?night

https://unsplash.com/collections/786923
https://unsplash.com/collections/2390759
https://unsplash.com/collections/4286478
https://unsplash.com/collections/991244
https://unsplash.com/collections/9550031
https://unsplash.com/collections/357644
https://unsplash.com/collections/1267066
https://unsplash.com/collections/1173230
https://unsplash.com/collections/3147309
https://unsplash.com/collections/3101394
https://unsplash.com/collections/11637825
https://unsplash.com/collections/2270725
https://unsplash.com/collections/64887918
https://unsplash.com/collections/1912928
*/

/* 
copy([...document.querySelectorAll(".mItv1 > div > figure > div > div > a")].map(el => [el.href, el.querySelector("img").src]))
 */
