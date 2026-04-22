import { DataTableDemo } from "@/components/table/data-table";
import { lazy } from "react";

const ChartAreaAxes = lazy(() => import("@/components/charts/chart-area"));
const ChartBarDefault = lazy(() => import("@/components/charts/chart-bar"));
const ChartPieDonutText = lazy(() => import("@/components/charts/chart-pie"));

export default function DashboardPage() {
  return (
    <div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
        <ChartBarDefault />
        <ChartAreaAxes />
        <ChartPieDonutText />
      </div>
      <div>
        <DataTableDemo />
      </div>
    </div>
  );
}
