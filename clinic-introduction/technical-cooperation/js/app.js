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

	// Clinic Position Sort Function
	const clinics = document.querySelectorAll(".clinic");
	const navContents = document.querySelectorAll(".detail-container>div");

	addGlobalEventListener("click", ".position-navigation a", (e) => {
		// Active Link
		document
			.querySelector(".position-navigation a.active")
			.classList.remove("active");
		e.target.classList.add("active");
		// Active Content
		let activeCity = e.target.dataset.city;
		let activeSort = document.querySelector(".detail-container>div.visible");

		activeSort.classList.remove("visible");
		activeSort.style.animation = `leave 1s 1`;
		navContents.forEach((navContent) => {
			if (activeCity === navContent.dataset.sort) {
				navContent.style.animation ? (navContent.style.animation = "") : "";
				navContent.classList.add("visible");
			}
		});

		console.log(e.target.dataset.city);
		clinics.forEach((clinic) => {
			if (activeCity === "all") {
				clinic.classList.remove("disappear");
				return;
			}
			clinic.dataset.position !== activeCity
				? clinic.classList.add("disappear")
				: clinic.classList.remove("disappear");
		});
	});
});