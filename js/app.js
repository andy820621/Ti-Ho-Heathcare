// Global EventListener
function addGlobalEventListener(type, selector, callback) {
	document.body.addEventListener(type, (e) => {
		if (e.target.matches(selector)) callback(e);
	});
}

document.addEventListener("DOMContentLoaded", function () {
	// Hide or Show Header Navigation when scroll-down/scroll-up
	const header = document.querySelector(".header");
	let noScrolling = 0,
		lastScrollTop = 0,
		navHeight = header.offsetHeight;

	window.addEventListener("scroll", onScroll);
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
});
