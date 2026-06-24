import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Briefcase, TrendingUp, Award } from "lucide-react";

/* Animated counter */
const AnimatedCounter = ({ target, suffix = "", label, icon: Icon }: { target: number; suffix?: string; label: string; icon: React.ElementType }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="glass-card gradient-border p-6 text-center group cursor-default"
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neon-purple/10 text-neon-purple transition-colors group-hover:bg-neon-purple/20">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-heading text-3xl md:text-4xl font-bold gradient-text">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

/* Interactive orbit ring */
const OrbitRing = () => {
  const items = [
    { angle: 0, label: "Analyze", color: "bg-neon-blue" },
    { angle: 60, label: "Match", color: "bg-neon-purple" },
    { angle: 120, label: "Learn", color: "bg-neon-cyan" },
    { angle: 180, label: "Grow", color: "bg-neon-blue" },
    { angle: 240, label: "Interview", color: "bg-neon-purple" },
    { angle: 300, label: "Hired", color: "bg-neon-cyan" },
  ];

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-glass-border"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => {
          const rad = (item.angle * Math.PI) / 180;
          const r = 50;
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <motion.div
              key={i}
              className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              whileHover={{ scale: 1.3 }}
            >
              <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
              <motion.span
                className="text-[9px] font-heading font-semibold text-muted-foreground whitespace-nowrap"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {item.label}
              </motion.span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full glass-card gradient-border flex items-center justify-center"
        >
          <span className="font-heading text-sm font-bold gradient-text">You</span>
        </motion.div>
      </div>
    </div>
  );
};

const ShowcaseSection = () => (
  <section id="about" className="relative py-24 md:py-32">
    <div className="container px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium tracking-widest uppercase text-neon-cyan/70 mb-3">
          Visual Insights
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold">
          Your career at a <span className="gradient-text">glance</span>
        </h2>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
        <AnimatedCounter target={50000} suffix="+" label="Careers Mapped" icon={Briefcase} />
        <AnimatedCounter target={120} suffix="+" label="Industries" icon={TrendingUp} />
        <AnimatedCounter target={10000} suffix="+" label="Users Guided" icon={Users} />
        <AnimatedCounter target={95} suffix="%" label="Satisfaction" icon={Award} />
      </div>

      {/* Orbit visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
        <OrbitRing />
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Our AI continuously analyzes, matches, and adapts your career journey — keeping you at the center.
        </p>
      </motion.div>
    </div>
  </section>
);

export default ShowcaseSection;
