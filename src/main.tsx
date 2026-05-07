import { createRoot } from "react-dom/client";
import "./index.css";
import { clearMalformedSupabaseAuthStorage } from "./lib/authStorage";

clearMalformedSupabaseAuthStorage();

const root = createRoot(document.getElementById("root")!);

import("./App.tsx").then(({ default: App }) => {
  root.render(<App />);
});
