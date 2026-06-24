import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-heading text-xl font-bold">
          <Sparkles className="h-6 w-6 text-neon-cyan" />
          <span className="gradient-text">CareerForge</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#"
            className="rounded-full border border-neon-blue/40 bg-neon-blue/10 px-5 py-1.5 text-sm font-medium text-neon-blue transition-all hover:bg-neon-blue/20 hover:shadow-[0_0_15px_hsl(210_100%_60%/0.3)]"
          >
            Login
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-card border-t border-glass-border"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#"
                className="rounded-full border border-neon-blue/40 bg-neon-blue/10 px-5 py-1.5 text-sm font-medium text-neon-blue text-center"
              >
                Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
