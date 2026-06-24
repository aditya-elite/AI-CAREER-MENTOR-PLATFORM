import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2 } from "lucide-react";
import { useState } from "react";

/* Animated sound wave bars */
const SoundWave = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[3px] h-8">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full bg-gradient-to-t from-neon-blue to-neon-cyan"
        animate={active ? {
          height: [8, 16 + Math.random() * 20, 8],
        } : { height: 4 }}
        transition={{
          duration: 0.4 + Math.random() * 0.3,
          repeat: active ? Infinity : 0,
          repeatType: "reverse" as const,
          delay: i * 0.05,
        }}
      />
    ))}
  </div>
);

const VoiceAISection = () => {
  const [listening, setListening] = useState(false);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neon-purple/10 blur-[120px]" />
      </div>

      <div className="container px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-xl mx-auto"
        >
          {/* Interactive pulsing mic */}
          <div className="relative mb-8">
            <AnimatePresence>
              {listening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-neon-blue/20"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-neon-purple/15"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 2.5, 1], opacity: [0.4, 0, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                  />
                </>
              )}
            </AnimatePresence>
            <motion.button
              onClick={() => setListening(!listening)}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full glass-card gradient-border cursor-pointer transition-shadow duration-300 ${
                listening ? "shadow-[0_0_30px_hsl(210_100%_60%/0.4)]" : ""
              }`}
            >
              {listening ? (
                <Volume2 className="h-8 w-8 text-neon-cyan" />
              ) : (
                <Mic className="h-8 w-8 text-neon-cyan" />
              )}
            </motion.button>
          </div>

          {/* Sound wave */}
          <div className="mb-6 h-8">
            <SoundWave active={listening} />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Voice-Powered <span className="gradient-text">AI Interviews</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Practice real interviews with voice-based AI. Get instant feedback on your answers, tone, and confidence — anytime, anywhere.
          </p>
          <p className="text-xs text-neon-cyan/60 font-medium">
            {listening ? "🎙️ Listening... click to stop" : "Click the mic to try it"}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceAISection;
