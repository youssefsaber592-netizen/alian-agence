"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* =========================================================
   REVEAL — scroll triggered entrance
========================================================= */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
  duration = 0.7,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* =========================================================
   COUNTER — animated statistics
========================================================= */

export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* =========================================================
   MARQUEE — infinite horizontal scroll
========================================================= */

export function Marquee({
  children,
  className,
  duration = 42,
  reverse = false,
  pauseOnHover = true,
  mask = true,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  mask?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        mask && "mask-fade-x",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max will-change-transform",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${duration}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TILT — pointer driven 3D hover
========================================================= */

export function Tilt({
  children,
  className,
  intensity = 7,
  style,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const handleMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * intensity * 2);
    rotateX.set(-py * intensity * 2);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   STARS — rating display
========================================================= */

export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span
      className={cn("relative inline-flex leading-none", className)}
      aria-label={`${rating} / 5`}
      role="img"
    >
      <span className="flex gap-0.5 text-slate-300">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} strokeWidth={1.6} />
        ))}
      </span>
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden text-amber-400"
        style={{ width: `${pct}%` }}
      >
        <span className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} strokeWidth={1.6} fill="currentColor" />
          ))}
        </span>
      </span>
    </span>
  );
}

/* =========================================================
   COUNTDOWN — offer urgency
========================================================= */

const TARGET = new Date("2026-12-31T23:59:59Z").getTime();

export function Countdown({
  labels,
  className,
}: {
  labels: { days: string; hours: string; minutes: string; seconds: string };
  className?: string;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, TARGET - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const days = Math.floor((remaining ?? 0) / 86_400_000);
  const hours = Math.floor(((remaining ?? 0) % 86_400_000) / 3_600_000);
  const minutes = Math.floor(((remaining ?? 0) % 3_600_000) / 60_000);
  const seconds = Math.floor(((remaining ?? 0) % 60_000) / 1000);

  const cells = [
    { value: days, label: labels.days },
    { value: hours, label: labels.hours },
    { value: minutes, label: labels.minutes },
    { value: seconds, label: labels.seconds },
  ];

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex min-w-[62px] flex-col items-center rounded-2xl border border-white/12 bg-white/8 px-3 py-2.5 backdrop-blur-md"
        >
          <span className="font-display text-xl font-extrabold tabular-nums text-white sm:text-2xl">
            {String(cell.value).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200/80">
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   SPOTLIGHT — cursor following glow
========================================================= */

export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const background = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) =>
      `radial-gradient(600px circle at ${latestX}% ${latestY}%, rgb(56 189 248 / 0.16), transparent 65%)`,
  );

  const onPointerMove = (event: ReactPointerEvent<T>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width) * 100);
    y.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  return { ref, background, onPointerMove };
}
