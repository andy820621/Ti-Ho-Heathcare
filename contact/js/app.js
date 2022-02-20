document.addEventListener("DOMContentLoaded", function () {
	// Global EventListener
	function addGlobalEventListener(type, selector, callback) {
		document.addEventListener(type, (e) => {
			if (e.target.matches(selector)) callback(e);
		});
	}

	// Clinic Navigation
	const clinicContainer = document.querySelector(".clinic-container");
	// let clinicContainerHeight = clinicContainer.offsetHeight;

	function resetClinicContainerHeight() {
		clinicContainer.style.minHeight =
			document.querySelector(".clinic-container>div.active").scrollHeight +
			240 +
			"px";
	}

	addGlobalEventListener("click", ".countries > li > h2", (e) => {
		if (e.target.closest("li").classList.contains("active")) return;
		// Remove all old active class
		let allOldActives = document.querySelectorAll("#clinic .active");
		allOldActives.forEach((allOldActive) =>
			allOldActive.classList.remove("active")
		);
		// Set Main Nav active List
		e.target.closest("li").classList.add("active");

		// Set Sub Nav active list
		e.target.nextElementSibling
			.querySelectorAll("li h3")[0]
			.classList.add("active");

		// Set clinic-country active
		let activeCountry = document.querySelector(`.${e.target.dataset.country}`);
		activeCountry.classList.add("active");

		// Set clinic-country's first child Active
		let firstCountryChild = activeCountry.firstElementChild;
		firstCountryChild.classList.add("active");
		// Set Active city
		let newActiveCitys = firstCountryChild.querySelectorAll(".city");
		newActiveCitys.forEach((newActiveCity) =>
			newActiveCity.classList.add("active")
		);
		// Set Active clinic-card
		let newActiveCards = firstCountryChild.querySelectorAll(".clinic-card");
		newActiveCards.forEach((newActiveCard) =>
			newActiveCard.classList.add("active")
		);

		resetClinicContainerHeight();
	});

	addGlobalEventListener("click", ".lists li h3", (e) => {
		if (e.target.classList.contains("active")) return;
		// Remove all old actives
		document.querySelector(".lists li h3.active").classList.remove("active");
		document
			.querySelectorAll(".clinic-container>div.active .active")
			.forEach((e) => {
				e.classList.remove("active");
			});
		// Set active lists-link
		e.target.classList.add("active");
		// Set active Sort
		let targetSort = e.target.dataset.sort;
		let activeSort = document.querySelector(
			`.clinic-container>div.active .${targetSort}`
		);
		console.log(activeSort);
		activeSort.classList.add("active");

		if (e.target.dataset.clinic === "franchisees") {
			activeSort
				.querySelectorAll(`.city:not(:last-child)`)
				.forEach((e) => e.classList.add("active"));
			activeSort
				.querySelectorAll(`.clinic-card[data-link="franchisees"]`)
				.forEach((e) => e.classList.add("active"));
		} else {
			activeSort
				.querySelectorAll(`.city`)
				.forEach((e) => e.classList.add("active"));
			activeSort
				.querySelectorAll(`.clinic-card`)
				.forEach((e) => e.classList.add("active"));
		}
	});
});
