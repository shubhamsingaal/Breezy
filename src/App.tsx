
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth-context";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create custom styles to fix the z-index issue with the weather map
const fixMapZIndexStyle = document.createElement('style');
fixMapZIndexStyle.innerHTML = `
  .leaflet-container {
    z-index: 10 !important;
  }
  
  header {
    z-index: 50 !important;
  }
  
  /* Make sure popups are above the map but below other UI */
  .leaflet-popup {
    z-index: 20 !important;
  }
  
  /* Ensure controls are usable */
  .leaflet-control {
    z-index: 30 !important;
  }
  
  /* Add smooth page transitions */
  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }
  
  .page-transition-exit {
    opacity: 1;
  }
  
  .page-transition-exit-active {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 300ms ease-in-out, transform 300ms ease-in-out;
  }
  
  /* Add smooth loading animation */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  /* Staggered loading animation for items */
  .staggered-item {
    opacity: 0;
    animation: fadeInUp 0.5s ease-out forwards;
  }
  
  .staggered-item:nth-child(1) { animation-delay: 0.1s; }
  .staggered-item:nth-child(2) { animation-delay: 0.2s; }
  .staggered-item:nth-child(3) { animation-delay: 0.3s; }
  .staggered-item:nth-child(4) { animation-delay: 0.4s; }
  .staggered-item:nth-child(5) { animation-delay: 0.5s; }
  
  /* Add proper z-index to ensure header is always on top */
  header.fixed {
    z-index: 1000 !important;
  }
  
  /* Ensure no leaflet controls overlap with other UI elements */
  .leaflet-top, .leaflet-bottom {
    z-index: 800 !important;
  }
  
  /* Add smooth transition for theme changes */
  body, .theme-transition {
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out;
  }
  
  /* Improved loading animation */
  @keyframes bounce-gentle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  @keyframes pop {
    0% {
      transform: scale(0.95);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes slide-up {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-bounce-gentle {
    animation: bounce-gentle 2s ease-in-out infinite;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
  
  .animate-pop {
    animation: pop 0.5s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out forwards;
  }
  
  /* Background gradients */
  .bg-gradient-dark {
    background: linear-gradient(to bottom, #1a202c, #2d3748);
  }
  
  .bg-gradient-light {
    background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
  }
`;
document.head.appendChild(fixMapZIndexStyle);

// Add splash screen visibility control
let splashScreen = null;
if (typeof window !== 'undefined') {
  splashScreen = localStorage.getItem('splashScreenShown');
  if (!splashScreen) {
    localStorage.setItem('splashScreenShown', 'true');
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
