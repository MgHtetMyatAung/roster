import { ThemeProvider } from "@/components/theme/theme-provider";
import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
}
