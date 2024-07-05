
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

{
	const logo = document.querySelector("img#logo");
	logo.addEventListener("dblclick", () => {
		if (document.fullscreenElement) document.exitFullscreen();
		else document.documentElement.requestFullscreen();
	});
	{
		let pointerDownX = 0;
		let dragging = false;
		logo.addEventListener("pointerdown", ({ clientX }) => {
			pointerDownX = clientX;
			dragging = true;
		});
		document.addEventListener("pointerup", ({ clientX }) => {
			if (dragging && clientX > pointerDownX + 200) location.assign("/goto/");
			dragging = false;
		});
		document.addEventListener("touchend", () => {
			dragging = false;
		});
	}
}

export { };
