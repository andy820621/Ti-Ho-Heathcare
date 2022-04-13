document.addEventListener("DOMContentLoaded", function () {
	// Slider
	// Selectors
	const slider = document.querySelector(".slider-container");
	const sliderGallery = document.querySelector(".slider-gallery");
	const dotContainer = document.querySelector(".dot-container");
	const btns = document.querySelectorAll(".product-content button");
	let sliderGalleryList = document.querySelectorAll(".slider-gallery li");
	let dots = document.querySelectorAll(".dot");

	let currentIndex = 0;
	let sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
	let sliderOffsetHeight = slider.offsetHeight;

	// Functions
	function setActiveSort() {
		document
			.querySelector(`.sort ul[aria-selected="true"] li[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");
		document
			.querySelectorAll(`.sort ul[aria-selected="true"] li`)[0]
			.setAttribute("aria-selected", "true");
		setSliderImage(
			document.querySelectorAll(`.sort ul[aria-selected="true"] li`)[0]
		);
	}
	function setSliderImage(target) {
		// Remove old images & dots
		sliderGallery.innerHTML = "";
		dotContainer.innerHTML = "";

		let imageDatas = [...target.querySelectorAll("span")];
		imageDatas.forEach((imageData) => {
			// Add images to gallery
			sliderGallery.innerHTML += `
				<li>
					<picture>
						<source
						srcset="${imageData.dataset.webp}"
						type="image/webp"
						/>
						<source srcset="${imageData.dataset.jpg}" type="image/jpeg" />
						<img src="${imageData.dataset.jpg}" alt="slider-image" />
					</picture>
				</li>
			`;

			// Add dots
			dotContainer.innerHTML += `<span class="dot"></span>`;
		});
		// Set active dot
		sliderGalleryList = document.querySelectorAll(".slider-gallery li");
		dots = document.querySelectorAll(".dot");
		if (dots.length !== 1) {
			dotContainer
				.querySelectorAll("span")[0]
				.setAttribute("aria-selected", "true");
			dots.forEach(function dot(e, index) {
				e.addEventListener("click", function () {
					if (index !== currentIndex) {
						currentIndex = index;
						resetCounter();
						sliderGallery.style.transform = `translateX(-${
							currentIndex * sliderWidth
						}px)`;
						SetDotActive(currentIndex);
						detectIfNeedtoAddInactive(currentIndex);
					}
				});
			});
		} else {
			document.querySelector(".dot").classList.add("inactive");
		}

		// Set Btn inactive
		btns.forEach((btn) => {
			imageDatas.length === 1
				? btn.classList.add("inactive")
				: btn.classList.remove("inactive");
		});

		// Reset slideFunction
		currentIndex = 0;
		sliderGallery.style.transform = `translateX(-${
			currentIndex * sliderWidth
		}px)`;
		if (imageDatas.length !== 1) {
			sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
			sliderOffsetHeight = slider.offsetHeight;
			detectIfNeedtoAddInactive(currentIndex);
			resetCounter();
			cancelAnimationFrame(slideanimationId);
			slideanimationId = requestAnimationFrame(SlideRepeater);
		} else {
			cancelAnimationFrame(slideanimationId);
		}
	}
	// Disable content menu
	window.oncontextmenu = function (event) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	// SlideFunction EventListener
	const updateSliderSize = throttle(() => {
		sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
		sliderGallery.style.transform = `translateX(-${
			currentIndex * sliderWidth
		}px)`;
		sliderOffsetHeight = slider.offsetHeight;
	}, 100);
	window.addEventListener("resize", updateSliderSize);
	addGlobalEventListener("click", "button.fas", (e) => {
		resetCounter();
		e.target.classList.contains("prev") ? slide("prev") : slide();
	});
	dots.forEach(function dot(e, index) {
		e.addEventListener("click", function () {
			if (index !== currentIndex) {
				currentIndex = index;
				resetCounter();
				sliderGallery.style.transform = `translateX(-${
					currentIndex * sliderWidth
				}px)`;
				SetDotActive(currentIndex);
				detectIfNeedtoAddInactive(currentIndex);
			}
		});
	});
	if (dots.length !== 1) {
		slider.addEventListener("mouseenter", (e) => {
			cancelAnimationFrame(slideanimationId);
		});
		slider.addEventListener("mouseleave", () => {
			slideanimationId = requestAnimationFrame(SlideRepeater);
		});
		addGlobalEventListener("mouseover", ".dot", (e) =>
			cancelAnimationFrame(slideanimationId)
		);
		addGlobalEventListener(
			"mouseout",
			".dot",
			(e) => (slideanimationId = requestAnimationFrame(SlideRepeater))
		);
		addGlobalEventListener("mouseover", "button.fas", (e) => {
			cancelAnimationFrame(slideanimationId);
		});
		addGlobalEventListener(
			"mouseout",
			"button.fas",
			(e) => (slideanimationId = requestAnimationFrame(SlideRepeater))
		);
	}

	// Slide Function
	function slide(derection = "next") {
		if (dots.length === 1) return;
		if (derection === "next") {
			currentIndex = (currentIndex + 1) % sliderGalleryList.length;
		} else {
			currentIndex =
				currentIndex === 0 ? sliderGalleryList.length : currentIndex;
			currentIndex = (currentIndex - 1) % sliderGalleryList.length;
		}
		sliderGallery.style.transform = `translateX(-${
			currentIndex * sliderWidth
		}px)`;
		detectIfNeedtoAddInactive(currentIndex);

		SetDotActive(currentIndex);
	}
	function SetDotActive(index) {
		if (dots.length === 1) return;
		document
			.querySelector(`.dot[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");
		dots[index].setAttribute("aria-selected", "true");
	}
	function detectIfNeedtoAddInactive(index) {
		switch (currentIndex) {
			case 0:
				document.querySelector(".prev").classList.add("inactive");
				document.querySelector(".next").classList.remove("inactive");
				break;
			case document.querySelectorAll(".dot").length - 1:
				document.querySelector(".next").classList.add("inactive");
				document.querySelector(".prev").classList.remove("inactive");
				break;
			default:
				btns.forEach((btn) => btn.classList.remove("inactive"));
		}
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

	// EventListener
	addGlobalEventListener("click", ".nav-links li h3", (e) => {
		// Remove active
		document
			.querySelector(`.nav-links li h3[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");
		document
			.querySelector(`.sort ul[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");

		// Add active
		let activeSortClassName = e.target.dataset.sort;
		e.target.setAttribute("aria-selected", "true");
		document
			.querySelector(`.sort ul.${activeSortClassName}`)
			.setAttribute("aria-selected", "true");

		// Set Gallery
		setActiveSort();
		// Set currentIndex
		currentIndex = 0;
	});
	addGlobalEventListener("click", `.sort ul[aria-selected="true"] li`, (e) => {
		if (!e.target.classList.contains("active")) {
			// Remove active
			document
				.querySelector(
					`.sort ul[aria-selected="true"] li[aria-selected="true"]`
				)
				.setAttribute("aria-selected", "false");
			// Add active
			e.target.setAttribute("aria-selected", "true");
			// Set Gallery
			setSliderImage(e.target);
			// Set currentIndex
			currentIndex = 0;
		}
	});
});
