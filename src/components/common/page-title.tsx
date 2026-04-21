import type { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
  return <h3 className=" font-medium mb-3">{children}</h3>;
}
