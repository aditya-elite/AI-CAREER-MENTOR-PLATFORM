import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Brain, BarChart3, Map, Mic, ShieldCheck, Zap } from "lucide-react";
import { useRef } from "react";

const features = [
  { icon: Brain, title: "AI Career Recommendations", desc: "Get personalized career paths matched to your unique skill profile and aspirations.", accent: "--neon-blue" },
  { icon: BarChart3, title: "Skill Gap Analysis", desc: "Identify exactly which skills to develop for your target role with data-driven insights.", accent: "--neon-purple" },
  { icon: Map, title: "Dynamic Learning Roadmap", desc: "Auto-generated learning plans that adapt as you grow and the market shifts.", accent: "--neon-cyan" },
  { icon: Mic, title: "AI Mock Interviews", desc: "Practice with realistic AI interviewers and receive instant, actionable feedback.", accent: "--neon-purple" },
  { icon: ShieldCheck, title: "Verified Skills", desc: "Earn verified badges that showcase your competencies to potential employers.", accent: "--neon-blue" },
  { icon: Zap, title: "Real-Time Job Matching", desc: "Get matched to live opportunities that align with your skills and career goals.", accent: "--neon-cyan" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

/* 3D tilt card */
const TiltCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 20 });
  const glowX = useMotionValue("50%");
  const glowY = useMotionValue("50%");

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(nx);
    y.set(ny);
    glowX.set(`${((nx + 0.5) * 100).toFixed(0)}%`);
    glowY.set(`${((ny + 0.5) * 100).toFixed(0)}%`);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardVariants}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="glass-card gradient-border p-6 md:p-8 group cursor-default relative overflow-hidden"
    >
      {/* Mouse-following glow */}
      <motion.div
        className="absolute w-40 h-40 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle, hsl(var(${feature.accent}) / 0.15), transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neon-blue/10 text-neon-blue transition-all duration-300 group-hover:bg-neon-blue/20 group-hover:scale-110">
          <feature.icon className="h-6 w-6" />
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => (
  <section id="features" className="relative py-24 md:py-32">
    <div className="container px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium tracking-widest uppercase text-neon-purple/70 mb-3">
          Features
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold">
          Everything you need to <span className="gradient-text">level up</span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <TiltCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
