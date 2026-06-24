import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* Interactive particle grid that responds to mouse */
const ParticleGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  const cols = 20;
  const rows = 12;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-auto">
      <svg className="w-full h-full opacity-30">
        {Array.from({ length: cols * rows }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cx = (col + 0.5) * (100 / cols);
          const cy = (row + 0.5) * (100 / rows);
          const pxX = (cx / 100) * (containerRef.current?.clientWidth ?? 1);
          const pxY = (cy / 100) * (containerRef.current?.clientHeight ?? 1);
          const dist = Math.hypot(mousePos.x - pxX, mousePos.y - pxY);
          const scale = Math.max(0, 1 - dist / 200);
          const r = 1.5 + scale * 3;

          return (
            <circle
              key={i}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r={r}
              fill={scale > 0.3 ? "hsl(var(--neon-cyan))" : "hsl(var(--muted-foreground))"}
              opacity={0.2 + scale * 0.8}
              style={{ transition: "r 0.15s, fill 0.15s, opacity 0.15s" }}
            />
          );
        })}
      </svg>
    </div>
  );
};

/* Magnetic button that follows cursor */
const MagneticButton = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple px-8 py-3.5 font-heading font-semibold text-primary-foreground transition-shadow hover:shadow-[0_0_40px_hsl(210_100%_60%/0.5)]"
    >
      {children}
    </motion.a>
  );
};

/* Animated typing text */
const TypeWriter = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    const timeout = deleting ? 40 : 80;

    if (!deleting && displayed === current) {
      const pause = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(pause);
    }
    if (deleting && displayed === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(
        deleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1)
      );
    }, timeout);
    return () => clearTimeout(timer);
  }, [displayed, deleting, index, texts]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const orbs = [
  { size: 300, x: "10%", y: "20%", color: "from-neon-blue/20 to-neon-purple/10", delay: 0, duration: 7 },
  { size: 200, x: "70%", y: "10%", color: "from-neon-purple/20 to-neon-cyan/10", delay: 2, duration: 9 },
  { size: 250, x: "80%", y: "60%", color: "from-neon-cyan/15 to-neon-blue/10", delay: 1, duration: 8 },
  { size: 150, x: "20%", y: "70%", color: "from-neon-purple/15 to-neon-blue/10", delay: 3, duration: 6 },
];

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 800], [3, -3]);
  const rotateY = useTransform(mouseX, [0, 1400], [-3, 3]);

  const handleMouse = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Interactive particle grid */}
      <ParticleGrid />

      {/* Background orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl pointer-events-none`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: orb.duration, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Content with subtle 3D tilt */}
      <motion.div
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="container relative z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-sm font-medium tracking-widest uppercase text-neon-cyan/70"
        >
          AI-Powered Career Intelligence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto"
        >
          Transform Your Skills into{" "}
          <br className="hidden sm:block" />
          <TypeWriter texts={["Careers with AI", "Dream Jobs", "Real Opportunities", "Your Future"]} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Smart career guidance, skill analysis, and personalized learning paths — all powered by cutting-edge AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex justify-center"
        >
          <MagneticButton href="#features">
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
