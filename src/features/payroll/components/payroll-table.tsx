import { useGetPayrollsQuery, useGetUsersQuery } from "@/api/user-api";
import DataTable from "@/components/table/table";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PayrollTable() {
  const { data: payrolls, isLoading: isPayrollLoading } = useGetPayrollsQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();

  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    users?.forEach((user) => {
      map.set(user.id, user.name);
    });
    return map;
  }, [users]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => <span className="font-mono text-xs">{String(info.getValue())}</span>,
      },
      {
        accessorKey: "userId",
        header: "Employee",
        cell: (info) => {
          const userId = String(info.getValue());
          const userName = userMap.get(userId) || "Unknown User";
          return <span className="font-medium">{userName}</span>;
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => {
          const amount = Number(info.getValue());
          return (
            <span className="font-semibold text-primary">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(amount)}
            </span>
          );
        },
        meta: {
          style: {
            textAlign: "right",
          },
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = String(info.getValue()).toLowerCase();
          let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
          
          if (status === "paid") variant = "default";
          else if (status === "pending") variant = "secondary";
          else if (status === "failed") variant = "destructive";

          return (
            <Badge variant={variant} className="capitalize">
              {status}
            </Badge>
          );
        },
      },
    ],
    [userMap],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payroll Management</h2>
          <p className="text-muted-foreground">
            Manage employee payrolls and payment statuses.
          </p>
        </div>
        <Button>Process Payroll</Button>
      </div>
      <DataTable
        tableId="payroll-table"
        label="Payroll"
        data={payrolls || []}
        columns={columns}
        isLoading={isPayrollLoading || isUsersLoading}
        emptyMessage="No payroll records found."
        enableGlobalFilter
        enablePagination
        pageSizeOptions={[10, 25, 50]}
        initialPageSize={10}
        renderRowActions={() => (
           <div className="flex gap-2 justify-end">
             <Button variant="ghost" size="sm">Details</Button>
           </div>
        )}
      />
    </div>
  );
}
