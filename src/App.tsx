import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";

import Dashboard from "./Dashboard.jsx";
import Landing from "./Landing.tsx";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const existing = document.querySelector('script[data-zapier-chatbot="careerforge"]');
    if (existing) return;

    const script = document.createElement("script");
    script.type = "module";
    script.async = true;
    script.src = "https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js";
    script.setAttribute("data-zapier-chatbot", "careerforge");
    document.body.appendChild(script);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 170,
            zIndex: 1000,
          }}
        >
          {createElement("zapier-interfaces-chatbot-embed", {
            "is-popup": "true",
            "chatbot-id": "cmndregnu0030sd0pkt9ct9nr",
          })}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
