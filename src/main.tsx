import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clearMalformedSupabaseAuthStorage } from "./lib/authStorage";

clearMalformedSupabaseAuthStorage();

createRoot(document.getElementById("root")!).render(<App />);
