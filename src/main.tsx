import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize theme from localStorage before React renders
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem('app-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Zustand persist stores as { state: {...}, version: 0 }
      const theme = parsed?.state?.theme || parsed?.theme;
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    } else {
      // Default to light mode if no storage
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    console.error('Error initializing theme:', error);
    // Default to light mode on error
    document.documentElement.classList.remove('dark');
  }
};

initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
