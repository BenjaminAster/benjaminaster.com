
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

(async () => {
	const imageBlob = await (await window.fetch("https://source.unsplash.com/random/?nature", { cache: "no-store" })).blob();
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
})();

export { };
