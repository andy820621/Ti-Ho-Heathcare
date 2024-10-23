document.addEventListener("DOMContentLoaded", function () {
	// Sevice section
	const serviceContainer = document.querySelector(".service-container");
	const serviceContent = document.querySelector(".service-content");
	const service = document.querySelector("#service");

	// 檢查是否需要顯示提示的函數
	function checkScrollHint() {
		if (serviceContent.offsetWidth > serviceContainer.offsetWidth) {
			service.classList.add("showScrollHint");
			serviceContent.classList.add("grab");
		} else {
			service.classList.remove("showScrollHint");
			serviceContent.classList.remove("grab");
		}
	}

	// 初始檢查
	checkScrollHint();

	// 監聽視窗大小改變
	window.addEventListener("resize", checkScrollHint);

	let isDragging = false;
	let startX;
	let scrollLeft;

	serviceContainer.addEventListener("mousedown", (e) => {
		isDragging = true;
		startX = e.pageX - serviceContainer.offsetLeft;
		scrollLeft = serviceContainer.scrollLeft;
		service.classList.remove("showScrollHint");
		serviceContent.classList.add("grabbing");
	});

	serviceContainer.addEventListener("mouseleave", () => {
		isDragging = false;
		checkScrollHint();
	});

	serviceContainer.addEventListener("mouseup", () => {
		isDragging = false;
		checkScrollHint();
		serviceContent.classList.remove("grabbing");
	});

	serviceContainer.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - serviceContainer.offsetLeft;
		const walk = (x - startX) * 2;
		serviceContainer.scrollLeft = scrollLeft - walk;
	});

	// 滾輪事件
	serviceContainer.addEventListener("wheel", (e) => {
		e.preventDefault();
		serviceContainer.scrollLeft += e.deltaY;
	});

	// History Year
	const yearTitle = document.querySelector(".year-title");
	const year1 = document.querySelector(".year-1");
	const year2 = document.querySelector(".year-2");
	const yearContainer = document.querySelector(".year-content-container");
	const yearLinks = document.querySelectorAll(".history-title a");
	const yearSections = yearContainer.querySelectorAll("section");
	const ContainerHeight = yearContainer.getBoundingClientRect().height;
	let sectionMinHeight = 320;
	let rootMarginBottom = ContainerHeight - sectionMinHeight + "px";
	const yearOptions = {
		root: yearContainer,
		rootMargin: `0px 0px -${rootMarginBottom} 0px`,
		threshold: [0.5],
	};

	const yearObserver = new IntersectionObserver((entries, yearObserver) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle("active", entry.isIntersecting);

			if (
				entry.target.classList.contains("active") &&
				entry.intersectionRatio > 0
			) {
				let current = entry.target.dataset.year;
				document
					.querySelector(`[aria-selected="true"]`)
					.setAttribute("aria-selected", "false");
				document
					.querySelector(`.history-title a.${current}`)
					.setAttribute("aria-selected", "true");
				let activeSectionDiv = document.querySelectorAll(
					".year-content-container .active >div"
				);

				let yearContent1 = activeSectionDiv[0].dataset.content;
				let yearContent2 = activeSectionDiv[1]
					? activeSectionDiv[1].dataset.content
					: "";
				// console.log(activeSection);
				if (activeSectionDiv[1]) {
					year1.style.animation = ``;
					year2.style.animation = ``;
					setTimeout(() => {
						year1.innerHTML = yearContent1;
						year2.innerHTML = yearContent2;
						year1.style.opacity = "1";
						year1.style.animation = `yearFade 0.4s ease`;
						year2.style.animation = `yearFade 0.4s ease`;
						yearTitle.style.transform = "translateY(0%)";
					}, 100);
				} else {
					year1.style.animation = ``;
					year2.style.animation = ``;
					setTimeout(() => {
						year2.innerHTML = yearContent1;
						year1.style.opacity = "0";
						year2.style.animation = `yearFade 0.4s ease`;
						yearTitle.style.transform = "translateY(-10%)";
					}, 100);
				}
			}
		});
	}, yearOptions);

	yearSections.forEach((yearSection) => {
		yearObserver.observe(yearSection);
	});

	yearLinks.forEach((yearLink) => {
		yearLink.addEventListener("click", (e) => {
			e.preventDefault();
			let current = yearLink.dataset.class;
			let target = yearContainer.querySelector(`.${current}`);
			let distance = target.offsetTop - yearContainer.offsetTop;
			yearContainer.scrollTo(0, distance);
		});
	});

	// Make sure when scroll Header Navigation is hidden
	const updateNavState = throttle(() => {
		if (document.querySelector(".header").classList.contains("nav-up")) return;
		document.querySelector(".header").classList.add("nav-up");
	}, 240);
	yearContainer.addEventListener("scroll", updateNavState);
});
