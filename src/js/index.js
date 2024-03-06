
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
	fullScreenMenu();
	initSmoothScroll();
	videoPlayer();
});

window.addEventListener('resize', () => {

});

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
	const locoScrollDefaults = {
		el: document.querySelector('[data-scroll-container]'),
		smooth: true,
		direction: "horizontal",
	};

	const locoScroll = new LocomotiveScroll(locoScrollDefaults);


	function scrollToSection() {
		const btns = document.querySelectorAll('[scroll-to]');

		btns.forEach((btn) => {
			btn.addEventListener('click', () => {
				const sectionClass = btn.getAttribute('scroll-to');
				locoScroll.scrollTo(document.querySelector(`.${sectionClass}`));
			})
		})
	}

	scrollToSection();

	// // GSAP integration
	// gsap.registerPlugin(ScrollTrigger);

	// locoScroll.on("scroll", ScrollTrigger.update);

	// ScrollTrigger.scrollerProxy(".smoothScroll", {
	// 	scrollTop(value) {
	// 		return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
	// 	},
	// 	scrollLeft(value) {
	// 		return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.x;
	// 	},

	// 	getBoundingClientRect() {
	// 		return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
	// 	},

	// 	pinType: document.querySelector(".smoothScroll").style.transform ? "transform" : "fixed"
	// });

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
	tl.to(links, { delay: 0.1, duration: 1, autoAlpha: 1, y: 0, opacity: 1, stagger: 0.15, ease: "power4.out" });
	tl.reverse();



	btn.addEventListener('click', () => {
		if (document.body.classList.contains('menu-opened')) {
			tl.reversed(!tl.reversed());
			document.body.classList.remove('menu-opened');
		} else {
			onStart();
			tl.play();
			document.body.classList.add('menu-opened');
		}
	});
}


