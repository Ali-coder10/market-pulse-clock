import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PreferencesProvider } from "@/lib/preferences";
import { Index } from "@/routes/index";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <PreferencesProvider>
        <Index />
      </PreferencesProvider>
    </QueryClientProvider>
  </StrictMode>,
);