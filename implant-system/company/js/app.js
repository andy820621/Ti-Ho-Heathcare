document.addEventListener("DOMContentLoaded", function () {
	// Side Navigation click function
	addGlobalEventListener("click", "#side-navigation a", (e) => {
		e.preventDefault();
		const navHeight = document.querySelector(".header").offsetHeight;
		const sideNavHeight = document.querySelector(
			"#side-navigation ul"
		).offsetHeight;
		let target = document.querySelector(`#${e.target.dataset.link}`);

		const isTablet = window.innerWidth <= 1023;

		let targetPosition = document.body.classList.contains("nav-up")
			? target.getBoundingClientRect().top
			: target.getBoundingClientRect().top - navHeight;

		if (isTablet) {
			targetPosition -= sideNavHeight;
		}

		window.scrollBy(0, targetPosition);
	});

	// Side Navigation active link when scroll to their own section
	const sections = document.querySelectorAll(
		".main-side-container > section:not(:nth-child(1))"
	);
	const sideNavOptions = {
		rootMargin: "-45% 0px -55%",
	};

	const sideNavObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			document
				.querySelector(`#side-navigation a[data-link ="${entry.target.id}"]`)
				.classList.toggle("active", entry.isIntersecting);
		});
	}, sideNavOptions);

	sections.forEach((section) => {
		sideNavObserver.observe(section);
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

	const updateSliderSize = throttle(() => {
		sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
		sliderGallery.style.transform = `translateX(-${
			currentIndex * sliderWidth
		}px)`;
		sliderOffsetHeight = slider.offsetHeight;
	}, 100);
	window.addEventListener("resize", updateSliderSize);
	// Disable content menu
	window.oncontextmenu = function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	// AddEventListener
	const updateSliderPosition = throttle(touchMove, 100);
	sliderGalleryList.forEach((li, index) => {
		const liImage = li.querySelector("img");
		liImage.addEventListener("dragstart", (e) => e.preventDefault());

		// Touch events
		li.addEventListener("touchstart", touchStart(index));
		li.addEventListener("touchend", touchEnd);
		li.addEventListener("touchcancel", touchEnd);
		li.addEventListener("touchmove", updateSliderPosition);
		// Mouse events
		li.addEventListener("mousedown", touchStart(index));
		li.addEventListener("mouseup", touchEnd);
		li.addEventListener("mouseleave", touchEnd);
		li.addEventListener("mousemove", updateSliderPosition);
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
		let moveBy = currentTranslate - prevTranslate;
		if (currentIndex == 0 && moveBy > 0) {
			sliderGallery.style.transform = `translateX(${currentTranslate / 10}px)`;
			return;
		}
		if (currentIndex == sliderGalleryList.length - 1 && moveBy < 0) {
			sliderGallery.style.transform = `translateX(${
				currentTranslate - moveBy * 0.9
			}px)`;
			return;
		}
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
			if (slideCounter % 360 === 0) {
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
