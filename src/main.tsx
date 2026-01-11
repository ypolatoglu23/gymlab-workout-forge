import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme from localStorage before render to prevent flash
const storedTheme = localStorage.getItem('gymlab-theme') || 'dark';
document.documentElement.classList.add(storedTheme);

createRoot(document.getElementById("root")!).render(<App />);