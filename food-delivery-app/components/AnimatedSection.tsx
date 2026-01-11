'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
    children: React.ReactNode;
    animation?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scale';
    delay?: number;
    className?: string;
}

export default function AnimatedSection({
    children,
    animation = 'fadeInUp',
    delay = 0,
    className = ''
}: AnimatedSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || typeof window === 'undefined') return;

        const animations: Record<string, gsap.TweenVars> = {
            fadeInUp: {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            },
            fadeIn: {
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            },
            slideInLeft: {
                opacity: 0,
                x: -100,
                duration: 1,
                ease: 'power3.out'
            },
            slideInRight: {
                opacity: 0,
                x: 100,
                duration: 1,
                ease: 'power3.out'
            },
            scale: {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: 'back.out(1.7)'
            }
        };

        const tween = gsap.from(sectionRef.current, {
            ...animations[animation],
            delay,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        return () => {
            tween.kill();
        };
    }, [animation, delay]);

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    );
}
