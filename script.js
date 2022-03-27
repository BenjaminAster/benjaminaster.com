
(async () => {
	document.body.style.setProperty("--background-image", `url("${URL.createObjectURL(
		await (await window.fetch("https://source.unsplash.com/random/?nature", { cache: "no-cache" })).blob()
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

export { };
