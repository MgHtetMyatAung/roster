import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCheck,
  Clock3,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type LeaveItem = {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  approver: string;
};

type LeaveDashboardProps = {
  leaves: LeaveItem[];
};

type StatusFilter = "all" | LeaveItem["status"];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getStatusTone(status: LeaveItem["status"]) {
  if (status === "Approved") {
    return "bg-emerald-500/12 text-emerald-700 ring-emerald-500/20";
  }

  if (status === "Pending") {
    return "bg-amber-500/12 text-amber-700 ring-amber-500/20";
  }

  return "bg-rose-500/12 text-rose-700 ring-rose-500/20";
}

export default function LeaveDashboard({ leaves }: LeaveDashboardProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredLeaves = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leaves.filter((leave) => {
      const matchesStatus =
        statusFilter === "all" ? true : leave.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [
              leave.name,
              leave.employeeId,
              leave.department,
              leave.role,
              leave.type,
              leave.reason,
            ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesStatus && matchesQuery;
    });
  }, [leaves, query, statusFilter]);

  const approvedCount = leaves.filter((leave) => leave.status === "Approved").length;
  const pendingCount = leaves.filter((leave) => leave.status === "Pending").length;
  const rejectedCount = leaves.filter((leave) => leave.status === "Rejected").length;
  const totalLeaveDays = leaves.reduce((total, leave) => total + leave.duration, 0);

  const summaryCards = [
    {
      title: "Total Requests",
      value: leaves.length.toString().padStart(2, "0"),
      description: `${filteredLeaves.length} requests in the current filtered view`,
      icon: CalendarClock,
    },
    {
      title: "Approved",
      value: approvedCount.toString().padStart(2, "0"),
      description: "Requests already cleared by team leads",
      icon: CheckCheck,
    },
    {
      title: "Pending Review",
      value: pendingCount.toString().padStart(2, "0"),
      description: "Requests still waiting for a decision",
      icon: Clock3,
    },
    {
      title: "Days Requested",
      value: totalLeaveDays.toString(),
      description: `${rejectedCount} rejected request${rejectedCount === 1 ? "" : "s"} in this set`,
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%)]">
        <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
            >
              Leave Control Center
            </Badge>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Leave oversight with a cleaner operational view
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6">
                Track time-off demand, review approval pressure, and scan upcoming
                absences without leaving the dashboard flow.
              </CardDescription>
            </div>
          </div>
          <div className="bg-background/80 text-muted-foreground flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm">
            <Sparkles className="size-4" />
            Updated for roster and approval monitoring
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.title} className="border-border/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold">
                  {item.value}
                </CardTitle>
              </div>
              <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-2xl">
                <item.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              {item.description}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="gap-4 border-b bg-muted/20 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle>Leave requests</CardTitle>
            <CardDescription>
              Review requests by employee, timeframe, status, and approver.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 md:w-auto md:flex-row">
            <div className="relative min-w-[280px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="text-muted-foreground size-4" />
              </div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search leave requests"
                className="h-10 rounded-xl pl-10"
              />
            </div>
            <div className="bg-muted inline-flex rounded-xl p-1">
              {(["all", "Approved", "Pending", "Rejected"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatusFilter(option)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    statusFilter === option
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead className="px-4 py-3">Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-4">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="font-medium">{leave.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {leave.employeeId} • {leave.department}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {leave.role}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{formatDate(leave.startDate)}</div>
                        <div className="text-muted-foreground text-sm">
                          to {formatDate(leave.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{leave.duration} day{leave.duration === 1 ? "" : "s"}</TableCell>
                    <TableCell>{leave.approver}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("ring-1", getStatusTone(leave.status))}
                      >
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <p className="text-muted-foreground max-w-[320px] whitespace-normal text-sm leading-6">
                        {leave.reason}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-14 text-center align-middle"
                  >
                    <div className="mx-auto max-w-md space-y-2">
                      <div className="text-lg font-medium">
                        No leave requests match this view
                      </div>
                      <p className="text-muted-foreground text-sm leading-6">
                        Try another keyword or broaden the status filter to review
                        more requests.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
