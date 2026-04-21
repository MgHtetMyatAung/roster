// import { ComponentExample } from "@/components/component-example";
import { RouterProvider } from "react-router";
import { routes } from "./routes";
import QueryProvider from "./providers/query-provider";

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={routes} />
    </QueryProvider>
  );
}

export default App;
