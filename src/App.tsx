
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
`;
document.head.appendChild(fixMapZIndexStyle);

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
