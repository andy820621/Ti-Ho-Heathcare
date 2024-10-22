// Global EventListener
function addGlobalEventListener(type, selector, callback) {
	document.body.addEventListener(type, (e) => {
		if (e.target.matches(selector)) callback(e);
	});
}
function stopPropagation(e) {
	e.stopPropagation();
}
// Throttle function
function throttle(cb, delay = 1000) {
	let shouldWait = false;
	let waitingArgs;
	const timeoutFunc = () => {
		if (waitingArgs == null) {
			shouldWait = false;
		} else {
			cb(...waitingArgs);
			waitingArgs = null;
			setTimeout(timeoutFunc, delay);
		}
	};

	return (...args) => {
		if (shouldWait) {
			waitingArgs = args;
			return;
		}

		cb(...args);
		shouldWait = true;

		setTimeout(timeoutFunc, delay);
	};
}

// Aria-expanded function
function ArilExpanded(e) {
	e.setAttribute(
		"aria-expanded",
		e.getAttribute("aria-expanded") == "true" ? "false" : "true"
	);
}
function ArilExpandedFalse(e) {
	e.setAttribute("aria-expanded", false);
}

document.addEventListener("DOMContentLoaded", function () {
	// Burger
	const navbar = document.querySelector(".navbar");
	const nav = document.querySelector("nav");
	const burger = document.querySelector(".hamburger");
	const navMenu = document.querySelector(".navMenu");
	const navLists = document.querySelectorAll(".navMenu > ul > li");

	// ClickBurger function
	function clickburger() {
		// Toggle Nav
		navMenu.classList.toggle("active");

		// Burger Animation
		navbar.classList.toggle("cross");

		// Animate Links
		navLists.forEach((li, index) => {
			if (navMenu.classList.contains("active")) {
				li.style.animation = `navMenuFade 0.5s ease forwards ${
					index / 7 + 0.3
				}s`;
			} else {
				li.style.animation = "";
			}
		});

		ArilExpanded(navMenu);

		if (navbar.classList.contains("cross")) {
			navbar.addEventListener("click", stopPropagation);
			document
				.querySelector("body>div")
				.addEventListener("click", clickMenuLink);
		} else {
			navbar.removeEventListener("click", stopPropagation);
			document
				.querySelector("body>div")
				.removeEventListener("click", clickMenuLink);
		}
	}

	function clickMenuLink() {
		ArilExpandedFalse(navMenu);

		// Close burger menu
		navMenu.classList.remove("active");
		navbar.classList.remove("cross");

		// Reset navMenu animate style
		navLists.forEach((li) => {
			li.style.animation = "";
		});
	}
	// EventListener
	burger.addEventListener("click", clickburger);

	// Mobile NavMenu submenu click function
	const dropdowns = document.querySelectorAll(".has-dropdown");

	dropdowns.forEach((dropdown) => {
		const link = dropdown.querySelector("a");
		const dropdownIcon = dropdown.querySelector(".dropdown-icon");

		// 為整個 dropdown 添加點擊事件
		dropdown.addEventListener("click", (e) => {
			// 防止點擊事件傳播到父元素
			e.stopPropagation();

			// 如果點擊的是下拉圖標，切換下拉菜單
			if (e.target.closest(".dropdown-icon")) {
				e.preventDefault();
				dropdown.classList.toggle("active");
			}
			// 如果點擊的是 li 的空白區域，也切換下拉菜單
			else if (e.target === dropdown) {
				dropdown.classList.toggle("active");
			}

			// 關閉其他打開的下拉菜單
			dropdowns.forEach((otherDropdown) => {
				if (
					otherDropdown !== dropdown &&
					otherDropdown.classList.contains("active")
				) {
					otherDropdown.classList.remove("active");
				}
			});
		});

		// 為鏈接添加單獨的點擊事件，以確保它可以正常跳轉
		link.addEventListener("click", (e) => {
			// 如果點擊的不是下拉圖標，允許跳轉
			if (!e.target.closest(".dropdown-icon")) {
				console.log("click a");
				// 跳轉將自動發生，不需要手動設置 window.location.href
			} else {
				e.preventDefault(); // 防止下拉圖標點擊時跳轉
			}
		});
	});

	// 點擊頁面其他地方時關閉所有下拉菜單
	document.addEventListener("click", () => {
		dropdowns.forEach((dropdown) => {
			dropdown.classList.remove("active");
		});
	});

	// Hide or Show Header Navigation when scroll-down/scroll-up
	const header = document.querySelector(".header");
	let noScrolling = 0,
		lastScrollTop = 0,
		navHeight = header.offsetHeight;

	const updateNavIfActive = throttle(onScroll, 500);
	window.addEventListener("scroll", updateNavIfActive);
	function onScroll() {
		if (noScrolling) return;
		if (
			window.innerHeight + window.pageYOffset >=
			document.body.offsetHeight - navHeight
		)
			return;
		requestAnimationFrame(hasScrolled);
		noScrolling = true;
	}
	function hasScrolled() {
		let windowScrollTop =
			window.pageYOffset ||
			document.documentElement.scrollTop + document.body.scrollTop;
		if (windowScrollTop > navHeight && windowScrollTop > lastScrollTop) {
			document.body.classList.add("nav-up");
		} else {
			document.body.classList.remove("nav-up");
		}
		lastScrollTop = windowScrollTop;
		noScrolling = false;
	}

	// Fade in when Scroll to their section
	const invisibles = document.querySelectorAll(".invisible");

	const appearOptions = {
		threshold: 0,
		rootMargin: "0px 0px -24px 0px",
	};

	const appearOnScroll = new IntersectionObserver(function (
		entries,
		appearOnScroll
	) {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			} else {
				entry.target.classList.remove("invisible");
				appearOnScroll.unobserve(entry.target);
			}
		});
	},
	appearOptions);

	invisibles.forEach((invisible) => {
		appearOnScroll.observe(invisible);
	});
});
