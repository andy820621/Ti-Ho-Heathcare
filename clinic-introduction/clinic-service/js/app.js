document.addEventListener("DOMContentLoaded", function () {
	// Side Navigation click function
	addGlobalEventListener("click", "#side-navigation a", (e) => {
		e.preventDefault();
		const navHeight = document.querySelector(".header").offsetHeight;
		const sideNavHeight =
			document.querySelector("#side-navigation").offsetHeight;
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

	// Clinic Position Sort Function
	const clinics = document.querySelectorAll(".clinic");

	addGlobalEventListener("click", ".position-navigation a", (e) => {
		if (e.target.getAttribute("aria-selected") === "true") return;
		document
			.querySelector(`.position-navigation a[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");
		e.target.setAttribute("aria-selected", "true");

		let activeCity = e.target.dataset.city;
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

	// Make sure when scroll Header Navigation is hidden
	const scrollContainer = document.querySelector(".scroll-container");
	const updateNavState = throttle(() => {
		if (document.body.classList.contains("nav-up")) return;
		document.body.classList.add("nav-up");
	}, 240);
	scrollContainer.addEventListener("scroll", updateNavState);
});
