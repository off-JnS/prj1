import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed word reveal: words brighten one by one while the paragraph
 * moves through the viewport. Words wrapped in *asterisks* render in the
 * serif accent voice.
 */
export default function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }

    const tween = gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.4,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => {
        const serif = word.startsWith("*") && word.replace(/[.,—!?]/g, "").endsWith("*");
        const clean = word.replaceAll("*", "");
        return (
          <span key={i}>
            <span data-word className={`inline-block ${serif ? "u-serif" : ""}`}>
              {clean}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
