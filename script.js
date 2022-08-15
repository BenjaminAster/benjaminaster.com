
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

const imageBlob = await (await window.fetch("https://source.unsplash.com/random/1600x900/?nature", { cache: "no-store" })).blob();
document.body.style.setProperty("--background-image", `url("${URL.createObjectURL(imageBlob)}")`);

const themeColor = await (async () => {
	const context = Object.assign(document.createElement("canvas"), {
		width: 1,
		height: 1,
	}).getContext("2d");
	context.imageSmoothingEnabled = true;
	context.drawImage(await window.createImageBitmap(imageBlob), 0, 0, 1, 1);
	return `rgb(${context.getImageData(0, 0, 1, 1).data.slice(0, 3).join(" ")})`;
})();

document.documentElement.style.setProperty("--theme-color", themeColor);

{
	const meta = document.createElement("meta");
	meta.setAttribute("name", "theme-color");
	meta.setAttribute("content", themeColor);
	document.head.appendChild(meta);
}

export { };
