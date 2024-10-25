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
	const navContents = document.querySelectorAll(".detail-container>div");
	const positionNavigation = document.querySelector(".position-navigation");

	// 初始化時計算一次
	adjustPadding();

	addGlobalEventListener("click", ".position-navigation a", (e) => {
		// Active Link
		if (e.target.getAttribute("aria-selected") === "true") return;
		document
			.querySelector(`.position-navigation a[aria-selected="true"]`)
			.setAttribute("aria-selected", "false");
		e.target.setAttribute("aria-selected", "true");

		// Active Content
		let activeCity = e.target.dataset.city;
		let activeSort = document.querySelector(".detail-container>div.visible");

		activeSort.classList.remove("visible");
		activeSort.style.animation = `leave 1s 1`;

		navContents.forEach((navContent) => {
			if (activeCity === navContent.dataset.sort) {
				navContent.style.animation ? (navContent.style.animation = "") : "";
				navContent.classList.add("visible");

				// 使用 setTimeout 確保在動畫完成後再計算高度
				setTimeout(() => {
					adjustPadding();
				}, 100); // 可以根據需要調整延遲時間
			}
		});

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

	// 監聽視窗大小改變，重新計算高度
	window.addEventListener("resize", adjustPadding);

	// 計算內容高度並設置 padding-bottom 的函數
	function adjustPadding() {
		const activeContent = document.querySelector(
			".detail-container>div.visible"
		);
		if (activeContent) {
			// 取得實際內容高度
			const contentHeight = activeContent.getBoundingClientRect().height;
			// 設置 padding-bottom (加上基本間距 5em)
			positionNavigation.style.paddingBottom = `calc(${contentHeight}px)`;
		}
	}

	// Make sure when scroll Header Navigation is hidden
	const scrollContainer = document.querySelector(".scroll-container");
	const updateNavState = throttle(() => {
		if (document.body.classList.contains("nav-up")) return;
		document.body.classList.add("nav-up");
	}, 240);
	scrollContainer.addEventListener("scroll", updateNavState);
});
