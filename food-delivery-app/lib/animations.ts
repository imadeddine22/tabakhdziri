import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export const animateFadeInUp = (selector: string, delay = 0) => {
    if (typeof window === 'undefined') return;

    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        delay,
        ease: 'power3.out'
    });
};

export const animateFadeIn = (selector: string, delay = 0) => {
    if (typeof window === 'undefined') return;

    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        duration: 1,
        delay,
        ease: 'power2.out'
    });
};

export const animateSlideInLeft = (selector: string, delay = 0) => {
    if (typeof window === 'undefined') return;

    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -100,
        duration: 1,
        delay,
        ease: 'power3.out'
    });
};

export const animateSlideInRight = (selector: string, delay = 0) => {
    if (typeof window === 'undefined') return;

    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 100,
        duration: 1,
        delay,
        ease: 'power3.out'
    });
};

export const animateStagger = (selector: string, staggerDelay = 0.1) => {
    if (typeof window === 'undefined') return;

    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: staggerDelay,
        ease: 'power2.out'
    });
};

export const animateScale = (selector: string, delay = 0) => {
    if (typeof window === 'undefined') return;

    gsap.from(selector, {
        scrollTrigger: {
            trigger: selector,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 1,
        delay,
        ease: 'back.out(1.7)'
    });
};

export const cleanupScrollTriggers = () => {
    if (typeof window === 'undefined') return;
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
