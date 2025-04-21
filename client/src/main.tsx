import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { demoBooks } from "./lib/demoData";
import { initializeLocalStorage } from "./lib/services";

// Initialize local storage with demo data
initializeLocalStorage(demoBooks);

createRoot(document.getElementById("root")!).render(<App />);
