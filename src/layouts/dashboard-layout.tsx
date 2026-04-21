import { useTypedLoaderData } from "@/hooks/use-loader-data";
import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/app-sidebar";
import Header from "./header/header";

type LoaderDataType = {
  user: string[];
};

export default function DashboardLayout() {
  const { user } = useTypedLoaderData<LoaderDataType>();
  console.log(user);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className=" p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
