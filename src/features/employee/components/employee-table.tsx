import { useGetEmployeesQuery } from "@/api/employee-api";
import DataTable from "@/components/table/table";
import { useMemo } from "react";
import type { EmployeeType } from "../type";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export default function EmployeeTable() {
  const { data: employeesData, isLoading } = useGetEmployeesQuery();

  const columns = useMemo<ColumnDef<EmployeeType>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: () => (
          <img
            src={"/vite.svg"}
            alt="Product"
            width={100}
            height={100}
            className="h-10 w-10 object-cover rounded"
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "fullName",
        header: "Product Name",
        cell: (info) => (
          <span className="font-medium">{String(info.getValue())}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => <span className="">{String(info.getValue())}</span>,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: (info) => `${info.getValue()}`,
        meta: {
          style: {
            textAlign: "right",
          },
        },
      },
      {
        accessorKey: "basicSalary",
        header: "Salary",
        cell: (info) => `${Number(info.getValue()).toFixed(2)} MMK`,
        meta: {
          style: {
            textAlign: "right",
          },
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: (info) => (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              info.getValue()
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Brands</h2>
      <DataTable
        tableId="brand"
        label="Brands"
        data={employeesData || []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[5, 10, 20]} // Different page size options
        initialPageSize={5}
        renderRowActions={() => <div className="flex gap-2"></div>}
        topRightComponent={<Button>Add Brand</Button>}
      />
    </div>
  );
}
