
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// IIFE for better scoping and to avoid polluting global scope
(function() {
  // Get the container once to avoid repeated DOM queries
  const container = document.getElementById("root");
  
  if (!container) {
    console.error("Root container not found");
    return;
  }
  
  // Create root only once and store it
  const root = createRoot(container);
  
  // Use setTimeout + requestAnimationFrame for non-blocking rendering with broader browser support
  setTimeout(() => {
    requestAnimationFrame(() => {
      root.render(<App />);
    });
  }, 0);
})();
