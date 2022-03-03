document.addEventListener("DOMContentLoaded", function () {
	// Global EventListener
	function addGlobalEventListener(type, selector, callback) {
		document.body.addEventListener(type, (e) => {
			if (e.target.matches(selector)) callback(e);
		});
	}

	// Side Navigation click function
	addGlobalEventListener("click", "#side-navigation a", (e) => {
		e.preventDefault();
		let target = document.querySelector(`#${e.target.dataset.link}`);
		let targetPosition = target.offsetTop;
		const startY = window.pageYOffset;
		let distance = targetPosition - startY;
		window.scrollTo(0, distance);
	});

	// Slider Animation
	// Selector
	const slider = document.querySelector("#education-training .content");
	const sliderGallery = document.querySelector(
		"#education-training .content ul"
	);
	const sliderGalleryList = [
		...document.querySelectorAll("#education-training .content ul li"),
	];
	const dots = document.querySelectorAll(".button-container button");
	// Global Variables
	let isDragging = false,
		startPos = 0,
		currentTranslate = 0,
		prevTranslate = 0,
		dragAnimationId = 0,
		currentIndex = 0;

	let sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
	let sliderOffsetHeight = slider.offsetHeight;

	window.addEventListener("resize", function () {
		sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
		sliderGallery.style.transform = `translateX(-${
			currentIndex * sliderWidth
		}px)`;

		sliderOffsetHeight = slider.offsetHeight;
	});
	// Disable content menu
	window.oncontextmenu = function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	// AddEventListener
	sliderGalleryList.forEach((li, index) => {
		const liImage = li.querySelector("img");
		liImage.addEventListener("dragstart", (e) => e.preventDefault());

		// Touch events
		li.addEventListener("touchstart", touchStart(index));
		li.addEventListener("touchend", touchEnd);
		li.addEventListener("touchmove", touchMove);
		// Mouse events
		li.addEventListener("mousedown", touchStart(index));
		li.addEventListener("mouseup", touchEnd);
		li.addEventListener("mouseleave", touchEnd);
		li.addEventListener("mousemove", touchMove);
	});
	dots.forEach(function dot(e, index) {
		e.addEventListener("click", function () {
			if (index !== currentIndex) {
				currentIndex = index;
				setPositionByIndex();
			}
		});
	});
	slider.addEventListener("mouseenter", (e) => {
		cancelAnimationFrame(slideanimationId);
	});
	slider.addEventListener("mouseleave", (e) => {
		slideanimationId = requestAnimationFrame(SlideRepeater);
	});
	addGlobalEventListener("mouseover", ".dot", (e) => {
		cancelAnimationFrame(slideanimationId);
	});
	addGlobalEventListener("mouseout", ".dot", (e) => {
		slideanimationId = requestAnimationFrame(SlideRepeater);
	});

	// Slide Function
	function touchStart(index) {
		return function (event) {
			currentIndex = index;
			startPos = getPositionX(event);
			isDragging = true;

			dragAnimationId = requestAnimationFrame(dragAnimation);
			sliderGallery.classList.add("grabbing");
		};
	}
	function touchEnd() {
		isDragging = false;
		cancelAnimationFrame(dragAnimationId);
		const moveBy = currentTranslate - prevTranslate;
		if (moveBy < -100 && currentIndex < sliderGalleryList.length - 1) {
			currentIndex += 1;
		}
		if (moveBy > 100 && currentIndex > 0) {
			currentIndex -= 1;
		}
		setPositionByIndex();
		sliderGallery.classList.remove("grabbing");
	}
	function touchMove(event) {
		if (isDragging) {
			const currentPosition = getPositionX(event);
			currentTranslate = prevTranslate + currentPosition - startPos;
		}
	}
	function getPositionX(event) {
		return event.type.includes("mouse")
			? event.pageX
			: event.touches[0].clientX;
	}
	function dragAnimation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(dragAnimation);
	}
	function setSliderPosition() {
		sliderGallery.style.transform = `translateX(${currentTranslate}px)`;
	}
	function setPositionByIndex() {
		resetCounter();
		currentTranslate = currentIndex * -sliderWidth;
		prevTranslate = currentTranslate;
		setSliderPosition();
		SetDotActive(currentIndex);
	}
	function slide(derection = "next") {
		if (derection === "next") {
			currentIndex = (currentIndex + 1) % sliderGalleryList.length;
		} else {
			currentIndex =
				currentIndex === 0 ? sliderGalleryList.length : currentIndex;
			currentIndex = (currentIndex - 1) % sliderGalleryList.length;
		}
		setPositionByIndex();
	}
	function SetDotActive(index) {
		document
			.querySelector(`.button-container button[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");
		dots[index].setAttribute("aria-selected", "true");
	}

	// Loop
	let slideCounter = 0;
	function SlideRepeater() {
		if (window.pageYOffset + window.innerHeight >= slider.offsetTop) {
			slideCounter++;
			// console.log(slideCounter);
			if (slideCounter % 300 === 0) {
				slide();
			}
		}
		slideanimationId = requestAnimationFrame(SlideRepeater);
	}
	SlideRepeater();
	// Loop control Function
	function resetCounter() {
		slideCounter = 0;
	}

	// Adapt requestAnimationFrame to each browser
	(function () {
		let lastTime = 0;
		let vendors = ["ms", "moz", "webkit", "o"];
		for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame =
				window[vendors[x] + "RequestAnimationFrame"];
			window.cancelAnimationFrame =
				window[vendors[x] + "CancelAnimationFrame"] ||
				window[vendors[x] + "CancelRequestAnimationFrame"];
		}
		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				let currTime = new Date().getTime();
				let timeToCall = Math.max(0, 16 - (currTime - lastTime));
				let id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
	})();
});
