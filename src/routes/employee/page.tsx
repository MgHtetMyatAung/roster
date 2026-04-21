import EmployeeTable from "@/features/employee/components/employee-table";
import { useTypedLoaderData } from "@/hooks/use-loader-data";

type EmployeeTypes = {
  employees: {
    id: number;
    name: string;
    role: string;
  }[];
};

export default function EmployeePage() {
  const { employees } = useTypedLoaderData<EmployeeTypes>();
  console.log(employees);
  return (
    <div>
      <EmployeeTable />
    </div>
  );
}
