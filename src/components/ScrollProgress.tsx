"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-400"
      />
      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={
          visible
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.6, y: 20 }
        }
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 end-6 z-[85] grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/30 transition-colors hover:bg-sky-600"
      >
        <ArrowUp className="h-4 w-4" />
      </motion.button>
    </>
  );
}
