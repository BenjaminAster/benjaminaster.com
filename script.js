

{
	// Polyfill for Safari < 15.4
	Array.prototype.at ??= function (index) {
		return index >= 0 ? this[index] : this[this.length + index];
	}
}

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
	const /** @type {HTMLCanvasElement} */ canvas = document.querySelector("canvas#background-canvas");
	const context = canvas.getContext("2d");

	{
		const resize = () => [canvas.width, canvas.height] = [canvas.clientWidth, canvas.clientHeight];
		resize();
		window.addEventListener("resize", resize);
	}

	const randomBySeed = (/** @type {number} */ a) => {
		// Mulberry32 algorithm, copied from https://stackoverflow.com/a/47593316
		let t = a += 0x6d_2b_79_f5;
		t = Math.imul(t ^ t >>> 0xf, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 0x3d);
		return ((t ^ t >>> 0xe) >>> 0) / 0x1_00_00_00_00;
	}

	let mouseX = -1000;
	let mouseY = -1000;

	window.addEventListener("mousemove", ({ clientX, clientY }) => {
		[mouseX, mouseY] = [clientX, clientY];
	})

	const distance = 100;
	const verticalDistance = distance / 2 * Math.sqrt(3);
	const maxOffset = distance / 4;

	const draw = (/** @type {number} */ time) => {
		context.fillStyle = "white";
		context.lineCap = "round";
		context.lineJoin = "round";
		context.clearRect(0, 0, canvas.width, canvas.height);

		const /** @type {[number, number][][]} */ points = [];
		const rows = Math.ceil(canvas.height / verticalDistance) + 2;
		const columns = Math.ceil(canvas.width / distance) + 1;
		for (let row = 0; row < rows; row++) {
			points.push([]);
			for (let column = 0; column < columns + row % 2; column++) {
				const initialX = (column - (row % 2) / 2) * distance;
				const initialY = (row - 1) * verticalDistance;

				const seedOffsetX = Math.sin(randomBySeed(row * columns + column) * (time + 10_000) / 1_000) * maxOffset;
				const seedOffsetY = Math.sin(randomBySeed(row * columns + column + 10) * (time + 20_000) / 1_000) * maxOffset;

				const mouseDistanceX = mouseX - (initialX + seedOffsetX);
				const mouseDistanceY = mouseY - (initialY + seedOffsetY);
				const mouseDistance = Math.hypot(mouseDistanceX, mouseDistanceY);
				const lerpValue = 1 - (.1 ** (mouseDistance / distance));

				const mouseOffsetX = mouseDistanceX / mouseDistance * lerpValue * -1 * distance / 2;
				const mouseOffsetY = mouseDistanceY / mouseDistance * lerpValue * -1 * distance / 2;

				points.at(-1).push([
					initialX + seedOffsetX + mouseOffsetX,
					initialY + seedOffsetY + mouseOffsetY,
				]);
			}
		}

		for (let row = 0; row < rows - 1; row++) {
			for (let triangleColumn = 0; triangleColumn < columns * 2 - 1; triangleColumn++) {
				context.fillStyle = `hsl(${randomBySeed(row * columns * 2 + triangleColumn)}turn 100% 50%)`;
				const column = Math.floor(triangleColumn / 2);
				context.beginPath();
				context.moveTo(...points[row][column + (row % 2) * (triangleColumn % 2)]);
				context.lineTo(...points[row + 1 - (row + triangleColumn) % 2][column + 1]);
				context.lineTo(...points[row + 1][column + (1 - row % 2) * (triangleColumn % 2)]);
				context.closePath();
				context.fill();
			}
		}

		context.strokeStyle = "black";
		context.lineWidth = 10;

		for (let row = 0; row < rows; row++) {
			context.beginPath();
			context.moveTo(...points[row][0])
			for (let column = 1; column < points[row].length; column++) {
				context.lineTo(...points[row][column]);
			}
			context.stroke();
		}

		for (let column = 0; column < columns; column++) {
			for (const pass of [0, 1]) {
				context.beginPath();
				context.moveTo(...points[0][column]);
				for (let row = 1; row < rows; row++) {
					context.lineTo(...points[row][column + pass * (row % 2)]);
				}
				context.stroke();
			}
		}

		window.requestAnimationFrame(draw);
	}

	window.requestAnimationFrame(draw);
}

export { };
