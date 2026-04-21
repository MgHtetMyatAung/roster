// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n/config.ts";

async function enableMocking() {
  if (import.meta.env.VITE_MOCK_API !== "true") return;

  const { worker } = await import("./mocks/browser");

  await worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js", // ✅ must match public path
      options: { type: "module" }, // needed for Vite + modern browsers
    },
    onUnhandledRequest: "bypass", // optional: ignore unknown requests
  });

  console.log("[MSW] Mocking enabled");
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
