
/// <reference types="better-typescript" />

if (location.pathname === "/home/") {
	history.replaceState(null, "", "/");
}

document.querySelector("button.email").addEventListener("click", function () {
	const email = [..."t a . x m g @ r e t s a . n i m a j n e b".replaceAll(" ", "")].reverse().join("");
	Object.assign(this.parentElement.querySelector(":scope > a"), {
		href: "mailto:" + email,
		textContent: email,
		hidden: false,
	});
});

{
	const img = document.querySelector("img#background-image");
	const removeLoading = () => document.documentElement.classList.remove("loading");
	if (img.complete) removeLoading();
	else img.addEventListener("load", removeLoading);
}

export { };
