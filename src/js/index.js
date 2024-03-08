
import '../styles/index.scss';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

const isTouchScreen = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);
const gsapMatchMedia = gsap.matchMedia();

document.addEventListener('DOMContentLoaded', () => {
	correctVh();
	fullScreenMenu();
	initSmoothScroll();
	videoPlayer();
});

window.addEventListener('resize', () => {
	setTimeout(() => {
		correctVh();
	}, 50);
});


// correctVh
function correctVh() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", vh + "px");
}

function videoPlayer() {
	const videoBlock = document.querySelectorAll('[video-player]');

	if (videoBlock && videoBlock.length > 0) {
		videoBlock.forEach(block => {
			block.addEventListener('click', () => {
				if (block.classList.contains('playing')) {
					block.classList.remove('playing');
					block.querySelector('video').pause();
				} else {
					block.classList.add('playing');
					block.querySelector('video').play()
				}
			})
		})
	}
}

function initSmoothScroll() {
	let locoScroll;

	const locoScrollDefaults = {
		el: document.querySelector('[data-scroll-container]'),
		smooth: true,
		direction: "horizontal",
		tablet: {
			breakpoint: 1200
		}
	};

	function initLocoScroll() {
		locoScroll = new LocomotiveScroll(locoScrollDefaults);
		trackScroll();
		scrollToSection();
	}

	function destroyLocoScroll() {
		locoScroll.destroy();
	}

	function scrollToSection() {
		const btns = document.querySelectorAll('[scroll-to]');

		btns.forEach((btn) => {
			btn.addEventListener('click', () => {
				const sectionClass = btn.getAttribute('scroll-to');
				locoScroll.scrollTo(document.querySelector(`.${sectionClass}`));
			})
		})
	}


	function trackScroll() {
		const sections = document.querySelectorAll('[data-section]');
		const navLinks = document.querySelectorAll('.sections-nav [scroll-to]');

		const handleScroll = () => {
			const scrollPosition = locoScroll.scroll.instance.scroll.x;

			sections.forEach((section) => {
				const sectionLeft = section.offsetLeft;
				const sectionRight = sectionLeft + section.offsetWidth;

				if (scrollPosition >= (sectionLeft - 3) && scrollPosition < sectionRight) {
					const sectionClass = section.getAttribute('data-section');

					navLinks.forEach((link) => {
						const linkSection = link.getAttribute('scroll-to');
						if (sectionClass === linkSection) {
							link.classList.add('active');
						} else {
							link.classList.remove('active');
						}
					});
				}
			});
		};

		locoScroll.on('scroll', handleScroll);
	}


	initLocoScroll();


	if (window.window > 12000) {
		window.removeEventListener('resize', locoScroll.scroll.checkResize, false)
		window.addEventListener('resize', () => resizescroll(), false);
	}



	function resizescroll() {
		if (!locoScroll.scroll.resizeTick) {
			locoScroll.scroll.resizeTick = true;
			requestAnimationFrame(() => {
				locoScroll.scroll.checkContext();
				updatescroll();
				locoScroll.scroll.resizeTick = false;
			});
		}
	}

	function updatescroll() {
		locoScroll.destroy()
		initLocoScroll();
	}
}




function fullScreenMenu() {
	const btn = document.querySelector(".header .open-menu");
	const menu = document.querySelector('.header .mega-menu');
	const links = menu.querySelectorAll('.header .mega-menu .menu li');

	function onStart() {
		document.body.classList.add('menu-opened');
		menu.classList.add('active');
		btn.classList.add('active');
	}

	function onComplete() {
		document.body.classList.remove('menu-opened');
		menu.classList.remove('active');
		btn.classList.remove('active');
	}



	const tl = gsap.timeline({
		paused: true,
		onReverseComplete: onComplete
	});

	gsap.set(links, { y: 30, opacity: 0, });
	tl.to(menu, {
		duration: 1,
		y: 0,
		ease: 'expo.inOut',
	})
	tl.to(links, { duration: 1, autoAlpha: 1, y: 0, opacity: 1, stagger: 0.15, ease: "power4.out" });
	tl.reverse();



	btn.addEventListener('click', () => {
		if (document.body.classList.contains('menu-opened')) {
			tl.reversed(!tl.reversed());
			document.body.classList.remove('menu-opened');

			if (window.innerWidth < 1200) {
				document.documentElement.style.removeProperty('overflow');
			}
		} else {
			onStart();
			tl.play();
			document.body.classList.add('menu-opened');

			if (window.innerWidth < 1200) {
				document.documentElement.style.overflow = 'hidden';
			}
		}
	});
}


