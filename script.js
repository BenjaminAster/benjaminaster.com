
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

{
	const imageURL = `https://source.unsplash.com/collection/1912928/${window.matchMedia("(orientation: landscape)").matches ? "1600x900" : "900x1600"}`;

	let imageIds;

	const getUnsplashLink = async (/** @type {{ imageId: string }} */ { imageId }) => {
		imageIds = {};
		imageIds = await (await window.fetch("./image-ids.json")).json();
		const { unsplashId } = imageIds.find(({ imageId: _imageId }) => _imageId === imageId) ?? {};
		return `https://unsplash.com/photos/${unsplashId}`;
	};

	{
		const imageId = new URLSearchParams(location.search).get("open-image");
		if (imageId) {
			window.open(await getUnsplashLink({ imageId }), "_self");
		}
	}

	$loop: for (let i = 0; i < 5; i++) {
		const response = await (async () => {
			try {
				return await window.fetch(imageURL, { cache: "reload" });
			} catch { }
		})();

		{
			const { imageId } = response?.url.match(/\/photo-(?<imageId>[^\?]+)\?/)?.groups ?? {};
			if (!imageId) continue $loop;

			const viewOriginalImageElement = /** @type {HTMLAnchorElement} */ (document.querySelector("#original-image-link"));
			viewOriginalImageElement.href = `/?open-image=${imageId}`;
			viewOriginalImageElement.onfocus = viewOriginalImageElement.onpointerenter = async () => {
				if (imageIds) return;
				viewOriginalImageElement.href = await getUnsplashLink({ imageId });
			};
		}

		{
			const imageBlob = await response.blob();
			document.documentElement.style.setProperty("--background-image", `url("${URL.createObjectURL(imageBlob)}")`);
			document.documentElement.classList.add("image-loaded");

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
		}

		break $loop;
	}
}

export { };
