"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import styles from "./ScrollRevealText.module.css";

const TEXT =
    "We help you discover the finest residences across Mumbai, partnering with the city’s most trusted developers to deliver homes that combine luxury, architecture, and timeless living.";

const Word = ({
    word,
    progress,
    range,
}: {
    word: string;
    progress: MotionValue<number>;
    range: [number, number];
}) => {
    const opacity = useTransform(progress, range, [0, 1]);
    const blurValue = useTransform(progress, range, [24, 0]);

    // We only need the blur here; the SVG filter handles the contrast/viscosity blending
    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    return (
        <motion.span style={{ opacity, filter, willChange: "filter, opacity" }} className={styles.word}>
            {word}
        </motion.span>
    );
};

const Char = ({
    char,
    progress,
    range,
}: {
    char: string;
    progress: MotionValue<number>;
    range: [number, number];
}) => {
    const opacity = useTransform(progress, range, [0, 1]);
    const blurValue = useTransform(progress, range, [24, 0]);

    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    return (
        <motion.span style={{ opacity, filter, willChange: "filter, opacity" }} className={styles.char}>
            {char}
        </motion.span>
    );
};

export default function ScrollRevealText() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 85%", "end end"],
    });

    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const words = TEXT.split(" ");
    const totalWords = words.length;
    // Account for spaces in total characters roughly, or exact
    const totalChars = TEXT.length;

    let charIndex = 0;

    return (
        <section ref={containerRef} className={styles.container}>
            <div className={styles.sticky}>
                <div className={styles.textWrapper}>
                    {mounted ? (
                        words.map((word, i) => {
                            // Word-level ranges (for mobile). Slightly stretched out for a smoother pace.
                            const wordStart = (i / totalWords) * 0.7;
                            const wordEnd = Math.min(wordStart + 0.2, 1);

                            return (
                                <span key={i} className={styles.wordGroup}>
                                    {isMobile ? (
                                        <Word
                                            word={word}
                                            progress={scrollYProgress}
                                            range={[wordStart, wordEnd]}
                                        />
                                    ) : (
                                        word.split("").map((char, j) => {
                                            // Spread character reveal out a bit more so it's not too fast
                                            const charStart = (charIndex / totalChars) * 0.5;
                                            charIndex++;
                                            const charEnd = Math.min(charStart + 0.15, 1);
                                            return (
                                                <Char
                                                    key={j}
                                                    char={char}
                                                    progress={scrollYProgress}
                                                    range={[charStart, charEnd]}
                                                />
                                            );
                                        })
                                    )}
                                    {/* Manually increment charIndex for space if desktop */}
                                    {!isMobile && (() => { charIndex++; return null; })()}
                                    <span className={styles.space}>&nbsp;</span>
                                </span>
                            );
                        })
                    ) : (
                        /* Fallback before mount */
                        <span style={{ opacity: 0 }}>{TEXT}</span>
                    )}

                    {/* SVG Filter for Liquid Glass/Gooey Effect on Text */}
                    <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
                        <filter id="liquid-glass">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="
                                1 0 0 0 0  
                                0 1 0 0 0  
                                0 0 1 0 0  
                                0 0 0 35 -15" result="liquid" />
                            <feBlend in="SourceGraphic" in2="liquid" />
                        </filter>
                    </svg>
                </div>
            </div>
        </section>
    );
}
