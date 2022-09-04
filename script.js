
// @ts-ignore
import generatePatternSVG from "https://benjaminaster.com/pattern-generator/main.js";

if (location.pathname === "/home/") {
	history.replaceState(null, "", "/");
}

if (document.cookie) {
	// delete all cookies
	for (const cookie of document.cookie.split(";")) {
		const name = cookie.match(/^[^=]+/)?.[0]?.trim();
		document.cookie = name + `=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${location.hostname}; path=/`;
	}
}

document.querySelector("button.email").addEventListener("click", function () {
	const email = [..."t a . x m g @ r e t s a . n i m a j n e b".replaceAll(" ", "")].reverse().join("");
	Object.assign(this.parentElement.querySelector(":scope > a"), {
		href: "mailto:" + email,
		textContent: email,
		hidden: false,
	});
});

(async () => {
	const { SVG, accentColorHue } = await generatePatternSVG();
	const blobURL = URL.createObjectURL(new Blob([SVG], { type: "image/svg+xml" }));
	document.documentElement.style.setProperty("--background-image", `url("${blobURL}")`);

	const themeColor = `hsl(calc(${accentColorHue} * 1turn) 60% 50%)`;
	document.documentElement.style.setProperty("--theme-color", themeColor);

	{
		const meta = document.createElement("meta");
		meta.setAttribute("name", "theme-color");
		meta.setAttribute("content", themeColor);
		document.head.appendChild(meta);
	}
})();

export { };
