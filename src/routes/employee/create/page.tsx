import { useGetUsersQuery } from "@/api/user-api";
import JsonView from "@/components/common/json-view";
import PageTitle from "@/components/common/page-title";
import EmployeeCreateForm from "@/features/employee/components/employee-create-form";

export default function CreateEmployeePage() {
  const { data, isLoading } = useGetUsersQuery();

  if (isLoading) return <p>Loading ...</p>;
  return (
    <div>
      <PageTitle>Leave Page</PageTitle>
      <EmployeeCreateForm />
      <JsonView data={data} />
    </div>
  );
}
