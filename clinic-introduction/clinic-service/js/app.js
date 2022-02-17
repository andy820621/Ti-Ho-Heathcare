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

	addGlobalEventListener("click", ".position-navigation a", (e) => {
		document
			.querySelector(".position-navigation a.active")
			.classList.remove("active");
		e.target.classList.add("active");

		let activeCity = e.target.dataset.city;
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
