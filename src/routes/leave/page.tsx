import JsonView from "@/components/common/json-view";
import PageTitle from "@/components/common/page-title";
import { useTypedLoaderData } from "@/hooks/use-loader-data";

type leaveTypes = {
  leaves: {
    id: number;
    name: string;
    role: string;
    type: string;
  }[];
};
export default function EmployeeLeavePage() {
  const { leaves } = useTypedLoaderData<leaveTypes>();
  console.log(leaves);
  return (
    <div>
      <PageTitle>Leave Page</PageTitle>
      <JsonView data={leaves} />
    </div>
  );
}
