import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface TestimonialVideoProps {
  src: string;
  poster?: string;
  authorName: string;
  authorRole?: string;
}

/**
 * Desktop (hover-capable): muted, looping, autoplay, grayscale by default.
 * On hover, restart at t=0, unmute, play in full color. On leave, re-mute
 * and restore grayscale.
 *
 * Touch / no-hover devices: always renders in color, muted-looped — the
 * hover-to-unmute interaction is meaningless without a pointer.
 */
export default function TestimonialVideo({
  src,
  poster,
  authorName,
  authorRole,
}: TestimonialVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const onEnter = () => {
    if (!canHover) return;
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    setHovered(true);
  };
  const onLeave = () => {
    if (!canHover) return;
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    setHovered(false);
  };

  const showColor = hovered || !canHover;

  return (
    <figure
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      className="group relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        muted
        loop
        autoPlay={canHover}
        preload={canHover ? "metadata" : "none"}
        className="h-full w-full object-cover transition-[filter] duration-500"
        style={{ filter: showColor ? "none" : "grayscale(1) contrast(1.05)" }}
      />
      {/* mute / unmute hint icon — only show on hover-capable devices */}
      {canHover && (
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 p-1.5 backdrop-blur-sm">
          {hovered ? (
            <Volume2 className="h-4 w-4 text-white" />
          ) : (
            <VolumeX className="h-4 w-4 text-white" />
          )}
        </div>
      )}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
        <div className="text-sm font-semibold">{authorName}</div>
        {authorRole && <div className="text-xs text-white/70">{authorRole}</div>}
      </figcaption>
    </figure>
  );
}
