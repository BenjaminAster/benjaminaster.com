
import projects from "./projects.js";

(async () => {
	(/** @type {HTMLElement} */ (document.body)).style.setProperty("--background-image", `url("${URL.createObjectURL(
		await (await fetch("https://source.unsplash.com/random/?nature", { cache: "no-cache" })).blob()
	)}")`);
})();

if (location.pathname === "/home/") {
	history.replaceState(null, "", "/");
}

document.querySelector("button.email").addEventListener("click", function () {
	const email = "ta.xmg@retsa.nimajneb".split("").reverse().join("");
	Object.assign(this.querySelector("a"), {
		href: "mailto:" + email,
		textContent: email,
		hidden: false,
	});
});

const /** @type {HTMLTemplateElement} */ template = document.querySelector(".projects template");
const cards = projects.map(() => {
	const clone = /** @type {HTMLElement} */ (template.content.cloneNode(true)).firstElementChild;
	document.querySelector(".projects ul").appendChild(clone);
	return clone;
});

const awaitCardLoaded = (() => {
	let resolve;
	const promise = new Promise((res) => resolve = res);

	return async ({ loaded = false } = {}) => {
		if (loaded) return resolve();
		await promise;
	};
})();

projects.forEach(async (project, index) => {
	let /** @type {Document} */ htmlDocument;

	if (!project.image || !project.title || !project.description) {
		htmlDocument = new DOMParser().parseFromString(await (await window.fetch(project.url, { cache: "reload" })).text(), "text/html");
		awaitCardLoaded({ loaded: true });
	} else {
		await awaitCardLoaded();
	}

	const /** @type {string} */ image = project.image ?? (() => {
		const href = htmlDocument.querySelector("link[rel=icon]")?.getAttribute("href");
		if (!href) return;
		const base = htmlDocument.querySelector("base")?.getAttribute("href") ?? "./";
		return new URL(href, new URL(base, new URL(project.url, location.origin))).href;
	})();

	const /** @type {string} */ title = project.title ?? htmlDocument.querySelector("title")?.textContent;

	const /** @type {string} */ description = project.description ?? htmlDocument.querySelector("meta[name=description]")?.getAttribute("content");

	const card = cards[index];

	card.querySelector("a").href = project.url;
	card.querySelector("img").src = image;
	card.querySelector("img").alt = card.querySelector(".title").textContent = title;
	card.querySelector(".description").textContent = description;

	card.classList.remove("invisible");
});

export { };
