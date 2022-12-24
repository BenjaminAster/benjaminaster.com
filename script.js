

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
	const initialSeed = Math.random();

	const randomBySeed = (/** @type {number} */ a) => {
		// Mulberry32 algorithm, copied from https://stackoverflow.com/a/47593316
		let t = a += 0x6d_2b_79_f5 + initialSeed * 0x1_00;
		t = Math.imul(t ^ t >>> 0xf, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 0x3d);
		return ((t ^ t >>> 0xe) >>> 0) / 0x1_00_00_00_00;
	}

	const /** @type {{ x: number, y: number, timestamp: number }[]} */ mousePositions = [];
	let mouseX = 1000;
	let mouseY = -1000;

	const pointerMove = ({/** @type {number} */ x,/** @type {number} */ y }) => {
		[mouseX, mouseY] = [x * window.devicePixelRatio, y * window.devicePixelRatio];
		mousePositions.unshift({ x: mouseX, y: mouseY, timestamp: document.timeline.currentTime });
	};

	window.addEventListener("mousemove", ({ clientX, clientY }) => {
		pointerMove({ x: clientX, y: clientY });
	});

	window.addEventListener("touchmove", ({ touches: [{ clientX, clientY }] }) => {
		pointerMove({ x: clientX, y: clientY });
	});

	{
		const /** @type {HTMLCanvasElement} */ canvas = document.querySelector("canvas#background-canvas");
		const context = canvas.getContext("2d");

		{
			const resize = () => {
				canvas.width = canvas.clientWidth * window.devicePixelRatio;
				canvas.height = canvas.clientHeight * window.devicePixelRatio;
			}
			resize();
			window.addEventListener("resize", resize);
		}

		const distance = 100 * window.devicePixelRatio;
		const verticalDistance = distance / 2 * Math.sqrt(3);
		const maxOffset = distance / 3;

		const draw = (/** @type {number} */ time) => {
			const t = performance.now();
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
			// context.lineWidth = 20 * window.devicePixelRatio;
			context.lineWidth = 13 * window.devicePixelRatio;
			context.fillStyle = "black";

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

			for (let row = 0; row < rows; row++) {
				for (let column = 0; column < points[row].length; column++) {
					context.beginPath();
					context.ellipse(...points[row][column], 15 * window.devicePixelRatio, 15 * window.devicePixelRatio, 0, 0, 2 * Math.PI);
					context.closePath();
					context.fill();
				}
			}

			context.strokeStyle = "white";
			context.lineWidth = 2 * window.devicePixelRatio;
			context.fillStyle = "black";

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

			for (let row = 0; row < rows; row++) {
				for (let column = 0; column < points[row].length; column++) {
					context.beginPath();
					context.ellipse(...points[row][column], 9 * window.devicePixelRatio, 9 * window.devicePixelRatio, 0, 0, 2 * Math.PI);
					context.closePath();
					context.fill();
					context.stroke();
				}
			}

			console.log(performance.now() - t);

			window.requestAnimationFrame(draw);
		}

		window.requestAnimationFrame(draw);
	}

	{
		const /** @type {HTMLCanvasElement} */ canvas = document.querySelector("canvas#foreground-canvas");
		const context = canvas.getContext("2d");

		{
			const resize = () => {
				canvas.width = canvas.clientWidth * window.devicePixelRatio;
				canvas.height = canvas.clientHeight * window.devicePixelRatio;
			}
			resize();
			window.addEventListener("resize", resize);
		}

		// const /** @type {[number, number][]} */ mousePositions = [...new Array(60)].map(() => [1000, -1000]);

		const draw = (/** @type {number} */ time) => {
			while (document.timeline.currentTime - mousePositions.at(-1)?.timestamp > 1_000) mousePositions.pop();

			context.lineCap = "round";
			context.lineJoin = "round";
			context.clearRect(0, 0, canvas.width, canvas.height);

			// context.lineWidth = 5 * window.devicePixelRatio;
			// context.strokeStyle = "white";
			// context.beginPath();
			// context.moveTo(...mousePositions[0]);

			// for (let index = 1; index < mousePositions.length; index++) {
			// 	context.lineTo(...mousePositions[index]);
			// }
			// context.stroke();


			for (const [index, { x, y, timestamp }] of mousePositions.entries()) {
				context.lineWidth = 1;
				const timeDelta = document.timeline.currentTime - timestamp;
				const alpha = 1 - timeDelta / 1_000;
				context.strokeStyle = `hsl(0 100% 100% / ${alpha})`;
				context.fillStyle = `hsl(0 100% 100% / ${alpha / 10})`;
				context.beginPath();
				const radius = timeDelta * window.devicePixelRatio / 30;
				context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.stroke();
			}

			window.requestAnimationFrame(draw);
		}

		window.requestAnimationFrame(draw);
	}
}

export { };
