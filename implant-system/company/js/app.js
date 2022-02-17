document.addEventListener("DOMContentLoaded", function () {
	// Global EventListener
	function addGlobalEventListener(type, selector, callback) {
		document.addEventListener(type, (e) => {
			if (e.target.matches(selector)) callback(e);
		});
	}

	// Side Navigation click function
	addGlobalEventListener("click", "#side-navigation a", (e) => {
		e.preventDefault();
		let target = document.querySelector(`#${e.target.dataset.link}`);
		let targetPosition = target.offsetTop;
		const startPosition = window.pageYOffset;
		let distance = targetPosition - startPosition;
		window.scrollTo(0, distance);
	});

	// Slider Animation
	// Selector
	const slider = document.querySelector("#education-training .content");
	const sliderGallery = document.querySelector(
		"#education-training .content ul"
	);
	const sliderGalleryList = document.querySelectorAll(
		"#education-training .content ul li"
	);
	const dots = document.querySelectorAll(".button-container button");

	function slideFunction() {
		let currentIndex = 0;
		let sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
		let sliderOffsetHeight = slider.offsetHeight;

		window.addEventListener("resize", function () {
			sliderWidth = sliderGalleryList[0].getBoundingClientRect().width;
			sliderGallery.style.marginLeft = -currentIndex * sliderWidth + "px";

			sliderOffsetHeight = slider.offsetHeight;
		});

		// Slide Function
		function slide(derection = "next") {
			if (derection === "next") {
				currentIndex = (currentIndex + 1) % sliderGalleryList.length;
			} else {
				currentIndex =
					currentIndex === 0 ? sliderGalleryList.length : currentIndex;
				currentIndex = (currentIndex - 1) % sliderGalleryList.length;
			}
			sliderGallery.style.marginLeft = -currentIndex * sliderWidth + "px";
			SetDotActive(currentIndex);
			SetLiActive(currentIndex);
		}
		function SetDotActive(index) {
			document
				.querySelector(".button-container button.active")
				.classList.remove("active");
			dots[index].classList.add("active");
		}
		function SetLiActive(index) {
			document
				.querySelector("#education-training .content ul li.active")
				.classList.remove("active");
			sliderGalleryList[index].classList.add("active");
		}

		// Loop
		let slideCounter = 0;
		function SlideRepeater() {
			if (window.pageYOffset + window.innerHeight >= sliderOffsetHeight) {
				slideCounter++;
			}
			if (slideCounter % 300 === 0) {
				slide();
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
			for (
				let x = 0;
				x < vendors.length && !window.requestAnimationFrame;
				++x
			) {
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

		// AddEventListener
		dots.forEach(function dot(e, index) {
			e.addEventListener("click", function () {
				if (index !== currentIndex) {
					currentIndex = index;
					resetCounter();
					sliderGallery.style.marginLeft = -currentIndex * sliderWidth + "px";
					SetDotActive(currentIndex);
					SetLiActive(currentIndex);
				}
			});
		});
		slider.addEventListener("mouseover", (e) => {
			cancelAnimationFrame(slideanimationId);
		});
		slider.addEventListener("mouseout", () => {
			slideanimationId = requestAnimationFrame(SlideRepeater);
		});
		addGlobalEventListener("mouseover", "button", (e) => {
			cancelAnimationFrame(slideanimationId);
		});
		addGlobalEventListener("mouseout", "button", (e) => {
			slideanimationId = requestAnimationFrame(SlideRepeater);
		});
	}
	slideFunction();
});
