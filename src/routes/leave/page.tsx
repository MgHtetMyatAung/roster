import LeaveDashboard, {
  type LeaveItem,
} from "@/features/leave/components/leave-dashboard";
import { useTypedLoaderData } from "@/hooks/use-loader-data";

type LeavePageData = {
  leaves: LeaveItem[];
};

export default function EmployeeLeavePage() {
  const { leaves } = useTypedLoaderData<LeavePageData>();

  return <LeaveDashboard leaves={leaves} />;
}
