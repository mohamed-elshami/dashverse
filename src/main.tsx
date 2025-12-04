import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize theme and language from localStorage before React renders
const initializeApp = () => {
  try {
    // Initialize theme
    const themeStored = localStorage.getItem('app-storage');
    if (themeStored) {
      const parsed = JSON.parse(themeStored);
      const theme = parsed?.state?.theme || parsed?.theme;
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize language
    const langStored = localStorage.getItem('language-storage');
    if (langStored) {
      const parsed = JSON.parse(langStored);
      const lang = parsed?.state?.language || parsed?.language || 'en';
      document.documentElement.lang = lang;
    } else {
      document.documentElement.lang = 'en'; // Default to English
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    // Defaults
    document.documentElement.classList.remove('dark');
    document.documentElement.lang = 'en';
  }
};

initializeApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
