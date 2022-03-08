document.addEventListener("DOMContentLoaded", function () {
	// Change Header Navigation backgroung-color when scroll-down/scroll-up
	const header = document.querySelector(".header");
	let noScrolling = 0,
		navHeight = header.offsetHeight;

	window.addEventListener("scroll", onScroll);
	function onScroll() {
		if (noScrolling) return;
		requestAnimationFrame(removeTransparent);
		noScrolling = true;
	}
	function removeTransparent() {
		if (window.pageYOffset > navHeight) {
			header.classList.remove("transparent");
		} else {
			header.classList.add("transparent");
		}
		noScrolling = false;
	}

	// Side Navigation click function
	addGlobalEventListener("click", "#side-navigation a", (e) => {
		e.preventDefault();
		let target = document.querySelector(`#${e.target.dataset.link}`);
		let targetPosition = document.body.classList.contains("nav-up")
			? target.getBoundingClientRect().top
			: target.getBoundingClientRect().top - navHeight;
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
});
