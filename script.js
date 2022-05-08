
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

const imageBlob = await (await window.fetch("https://source.unsplash.com/random/?nature", { cache: "reload" })).blob();
document.body.style.setProperty("--background-image", `url("${URL.createObjectURL(imageBlob)}")`);

const context = document.createElement("canvas").getContext("2d");
context.imageSmoothingEnabled = true;
context.drawImage(await window.createImageBitmap(imageBlob), 0, 0, 1, 1);
const themeColor = `rgb(${context.getImageData(0, 0, 1, 1).data.slice(0, 3).join(" ")})`;
document.querySelector("meta[name=theme-color]").setAttribute("content", themeColor);

export { };
