import { useGetPayrollsQuery } from "@/api/user-api";
import JsonView from "@/components/common/json-view";
import PageTitle from "@/components/common/page-title";

export default function PayrollPage() {
  const { data, isLoading } = useGetPayrollsQuery();

  if (isLoading) return <p>Loading ...</p>;
  return (
    <div>
      <PageTitle>Payroll</PageTitle>
      <JsonView data={data} />
    </div>
  );
}
