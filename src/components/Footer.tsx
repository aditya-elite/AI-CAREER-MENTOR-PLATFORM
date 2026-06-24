import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-glass-border py-10">
    <div className="container px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2 font-heading font-bold text-foreground">
        <Sparkles className="h-4 w-4 text-neon-cyan" />
        CareerForge
      </div>
      <div className="flex gap-6">
        <a href="#about" className="hover:text-foreground transition-colors">About</a>
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
      </div>
      <p>© 2026 CareerForge. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
