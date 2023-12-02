
/// <reference lib="DOM" />
/// <reference lib="DOM.Iterable" />
/// <reference types="better-typescript" />

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
	const backgroundCanvas = document.querySelector("canvas#background-canvas");

	const backgroundOffscreen = backgroundCanvas.transferControlToOffscreen?.();

	const backgroundCanvasFunction = async (/** @type {{ devicePixelRatio: number }} */ { devicePixelRatio }) => {

		const initialSeed = Math.random();

		const randomBySeed = (/** @type {number} */ a) => {
			// Mulberry32 algorithm, copied from https://stackoverflow.com/a/47593316
			let t = a += 0x6d_2b_79_f5 + initialSeed * 0x1_00;
			t = Math.imul(t ^ t >>> 0xf, t | 1);
			t ^= t + Math.imul(t ^ t >>> 7, t | 0x3d);
			return ((t ^ t >>> 0xe) >>> 0) / 0x1_00_00_00_00;
		}

		let mouseX = 1000;
		let mouseY = -1000;

		const messageListener = ({ type, mouseX: _mouseX, mouseY: _mouseY, width, height }) => {
			if (type === "pointermove") {
				mouseX = _mouseX;
				mouseY = _mouseY;
			} else if (type === "resize") {
				canvas.width = width * devicePixelRatio;
				canvas.height = height * devicePixelRatio;
			}
		};

		let /** @type {{ canvas: OffscreenCanvas | HTMLCanvasElement, context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D }} */ { canvas, context } = self.window
			? { canvas: backgroundCanvas, context: backgroundCanvas.getContext("2d") }
			: await new Promise((resolve) => {
				self.addEventListener("message", ({ data }) => {
					if (data.type === "transfer-offscreen") {
						resolve({
							context: /** @type {OffscreenCanvasRenderingContext2D} */ (data.canvas.getContext("2d")),
							canvas: data.canvas,
						});
					} else {
						messageListener(data);
					}
				});
			});

		const distance = 100 * devicePixelRatio;
		const verticalDistance = distance / 2 * Math.sqrt(3);
		const maxOffset = distance / 3;

		const draw = (/** @type {number} */ time) => {
			const t = performance.now();
			// console.log(t)
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

			// for (let row = 0; row < rows - 1; row++) {
			// 	for (let triangleColumn = 0; triangleColumn < columns * 2 - 1; triangleColumn++) {
			// 		context.fillStyle = `hsl(${randomBySeed(row * columns * 2 + triangleColumn)}turn 100% 50%)`;
			// 		// context.fillStyle = `hsl(${randomBySeed(row * columns * 2 + triangleColumn)}turn 80% 70%)`;
			// 		const column = Math.floor(triangleColumn / 2);
			// 		context.beginPath();
			// 		context.moveTo(...points[row][column + (row % 2) * (triangleColumn % 2)]);
			// 		context.lineTo(...points[row + 1 - (row + triangleColumn) % 2][column + 1]);
			// 		context.lineTo(...points[row + 1][column + (1 - row % 2) * (triangleColumn % 2)]);
			// 		context.closePath();
			// 		context.fill();
			// 	}
			// }

			context.strokeStyle = "white";
			// context.lineWidth = 20 * devicePixelRatio;
			// context.lineWidth = 13 * devicePixelRatio;
			context.lineWidth = 3.5 * devicePixelRatio;
			// context.fillStyle = "black";

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

			// for (let row = 0; row < rows; row++) {
			// 	for (let column = 0; column < points[row].length; column++) {
			// 		context.beginPath();
			// 		// context.ellipse(...points[row][column], 15 * devicePixelRatio, 15 * devicePixelRatio, 0, 0, 2 * Math.PI);
			// 		context.ellipse(...points[row][column], 22 * devicePixelRatio, 22 * devicePixelRatio, 0, 0, 2 * Math.PI);
			// 		context.closePath();
			// 		context.fill();
			// 	}
			// }

			// context.strokeStyle = "white";
			// context.lineWidth = 2 * devicePixelRatio;
			// context.fillStyle = "black";

			// for (let row = 0; row < rows; row++) {
			// 	context.beginPath();
			// 	context.moveTo(...points[row][0])
			// 	for (let column = 1; column < points[row].length; column++) {
			// 		context.lineTo(...points[row][column]);
			// 	}
			// 	context.stroke();
			// }

			// for (let column = 0; column < columns; column++) {
			// 	for (const pass of [0, 1]) {
			// 		context.beginPath();
			// 		context.moveTo(...points[0][column]);
			// 		for (let row = 1; row < rows; row++) {
			// 			context.lineTo(...points[row][column + pass * (row % 2)]);
			// 		}
			// 		context.stroke();
			// 	}
			// }

			// for (let row = 0; row < rows; row++) {
			// 	for (let column = 0; column < points[row].length; column++) {
			// 		context.beginPath();
			// 		context.ellipse(...points[row][column], 9 * devicePixelRatio, 9 * devicePixelRatio, 0, 0, 2 * Math.PI);
			// 		context.closePath();
			// 		context.fill();
			// 		context.stroke();
			// 	}
			// }

			// console.log(performance.now() - t);

			self.requestAnimationFrame(draw);
		}

		self.requestAnimationFrame(draw);

		return { postMessage: messageListener };
	};

	const backgroundCanvasWorker = backgroundOffscreen ? new Worker(
		URL.createObjectURL(new Blob([
			`(${backgroundCanvasFunction.toString()})(${JSON.stringify({
				devicePixelRatio: window.devicePixelRatio,
			})})`
		], { type: "application/javascript" }
		))
	) : await backgroundCanvasFunction({ devicePixelRatio: window.devicePixelRatio });

	if (backgroundOffscreen) backgroundCanvasWorker.postMessage(
		{ type: "transfer-offscreen", canvas: backgroundOffscreen },
		{ transfer: [backgroundOffscreen] },
	);

	const /** @type {HTMLCanvasElement} */ foregroundCanvas = document.querySelector("canvas#foreground-canvas");

	const foregroundOffscreen = foregroundCanvas.transferControlToOffscreen?.();

	const foregroundCanvasFunction = async (/** @type {{ devicePixelRatio: number }} */ { devicePixelRatio }) => {
		const /** @type {{ x: number, y: number, timestamp: number }[]} */ mousePositions = [];

		const messageListener = ({ type, mouseX, mouseY, width, height }) => {
			if (type === "pointermove") {
				mousePositions.unshift({ x: mouseX, y: mouseY, timestamp: performance.now() });
			} else if (type === "resize") {
				canvas.width = width * devicePixelRatio;
				canvas.height = height * devicePixelRatio;
			}
		};

		let /** @type {{ canvas: OffscreenCanvas | HTMLCanvasElement, context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D }} */ { canvas, context } = self.window
			? { canvas: foregroundCanvas, context: foregroundCanvas.getContext("2d") }
			: await new Promise((resolve) => {
				self.addEventListener("message", ({ data }) => {
					if (data.type === "transfer-offscreen") {
						resolve({
							context: /** @type {OffscreenCanvasRenderingContext2D} */ (data.canvas.getContext("2d")),
							canvas: data.canvas,
						});
					} else {
						messageListener(data);
					}
				});
			});

		const duration = 2_000;

		const draw = (/** @type {number} */ time) => {
			while (performance.now() - mousePositions.at(-1)?.timestamp > duration) mousePositions.pop();

			context.lineCap = "round";
			context.lineJoin = "round";
			context.clearRect(0, 0, canvas.width, canvas.height);

			for (const { x, y, timestamp } of mousePositions) {
				context.lineWidth = 1;
				const timeDelta = performance.now() - timestamp;
				const alpha = 1 - timeDelta / duration;
				context.strokeStyle = `hsl(0 100% 100% / ${alpha / 2})`;
				context.fillStyle = `hsl(0 100% 100% / ${alpha / 10})`;
				context.beginPath();
				const radius = (timeDelta + 500) * devicePixelRatio / 60;
				context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
				context.closePath();
				context.fill();
				context.stroke();
			}

			self.requestAnimationFrame(draw);
		}

		// self.requestAnimationFrame(draw);

		return { postMessage: messageListener };
	};

	const foregroundCanvasWorker = foregroundOffscreen ? new Worker(
		URL.createObjectURL(new Blob([
			`(${foregroundCanvasFunction.toString()})(${JSON.stringify({
				devicePixelRatio: window.devicePixelRatio,
			})})`
		], { type: "application/javascript" }))
	) : await foregroundCanvasFunction({ devicePixelRatio: window.devicePixelRatio });

	if (foregroundOffscreen) foregroundCanvasWorker.postMessage(
		{ type: "transfer-offscreen", canvas: foregroundOffscreen },
		{ transfer: [foregroundOffscreen] },
	);

	const pointerMove = (/** @type {{ x: number, y: number }} */ { x, y }) => {
		const [mouseX, mouseY] = [x * window.devicePixelRatio, y * window.devicePixelRatio];
		backgroundCanvasWorker.postMessage({ type: "pointermove", mouseX, mouseY });
		foregroundCanvasWorker.postMessage({ type: "pointermove", mouseX, mouseY });
	};

	window.addEventListener("mousemove", ({ clientX, clientY }) => {
		pointerMove({ x: clientX, y: clientY });
	});

	window.addEventListener("touchmove", ({ touches: [{ clientX, clientY }] }) => {
		pointerMove({ x: clientX, y: clientY });
	});

	{
		const resize = () => {
			backgroundCanvasWorker.postMessage({
				type: "resize",
				width: backgroundCanvas.clientWidth,
				height: backgroundCanvas.clientHeight,
			});
			foregroundCanvasWorker.postMessage({
				type: "resize",
				width: foregroundCanvas.clientWidth,
				height: foregroundCanvas.clientHeight,
			});
		}
		resize();
		window.addEventListener("resize", resize);
	}
}

export { };
