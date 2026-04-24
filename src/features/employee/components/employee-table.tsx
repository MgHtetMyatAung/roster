import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { useGetEmployeesQuery } from "@/api/employee-api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ROUTE_LINKS } from "@/constants/route.links";
import { employeeDemoData } from "@/features/employee/data";
import { cn } from "@/lib/utils";

const currencyFormatter = new Intl.NumberFormat("en-US");
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

type StatusFilter = "all" | "active" | "inactive";

function getEmployeeInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatSalary(amount: number) {
  return `${currencyFormatter.format(amount)} MMK`;
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getEmployeeDetailLink(employeeId: string) {
  return ROUTE_LINKS.VIEW_EMPLOYEE.replace(":id", employeeId);
}

function getStatusTone(status: string) {
  return status === "Active"
    ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/20"
    : "bg-amber-500/12 text-amber-700 ring-amber-500/20";
}

export default function EmployeeTable() {
  const { data, isLoading } = useGetEmployeesQuery();
  const hasEmployeeData = Array.isArray(data) && data.length > 0;
  const employeesData = hasEmployeeData ? data : employeeDemoData;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return employeesData.filter((employee) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : employee.status.toLowerCase() === statusFilter;
      const matchesSearch =
        normalizedQuery.length === 0
          ? true
          : [
              employee.employeeId,
              employee.fullName,
              employee.email,
              employee.phone,
              employee.department,
              employee.position,
            ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesStatus && matchesSearch;
    });
  }, [employeesData, searchQuery, statusFilter]);

  const activeCount = employeesData.filter(
    (employee) => employee.status === "Active",
  ).length;
  const departmentsCount = new Set(
    employeesData.map((employee) => employee.department),
  ).size;
  const averageSalary =
    employeesData.length > 0
      ? Math.round(
          employeesData.reduce(
            (total, employee) => total + employee.basicSalary,
            0,
          ) / employeesData.length,
        )
      : 0;

  const overviewCards = [
    {
      title: "Roster Size",
      value: employeesData.length.toString().padStart(2, "0"),
      description: `${filteredEmployees.length} visible in current view`,
      icon: Users,
    },
    {
      title: "Active Employees",
      value: activeCount.toString().padStart(2, "0"),
      description: `${employeesData.length - activeCount} inactive team members`,
      icon: BriefcaseBusiness,
    },
    {
      title: "Departments",
      value: departmentsCount.toString(),
      description: "Cross-functional coverage across the org",
      icon: Building2,
    },
    {
      title: "Average Salary",
      value: formatSalary(averageSalary),
      description: "Current monthly baseline across the roster",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-gradient-to-br from-background via-background to-muted/40">
        <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
            >
              Employee Directory
            </Badge>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                People roster built for quick scanning
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6">
                Review headcount, spot role distribution, and jump into a
                detailed profile without leaving the dashboard rhythm.
              </CardDescription>
            </div>
          </div>
          <Button asChild>
            <Link to={ROUTE_LINKS.CREATE_EMPLOYEE}>
              <Plus className="size-4" />
              Add Employee
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item) => (
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
            <CardTitle>Employee list</CardTitle>
            <CardDescription>
              Search by name, employee ID, contact details, or department.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 md:w-auto md:flex-row">
            <div className="relative min-w-[260px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="text-muted-foreground size-4" />
              </div>
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search employees"
                className="h-10 rounded-xl pl-10"
              />
            </div>
            <div className="bg-muted inline-flex rounded-xl p-1">
              {(["all", "active", "inactive"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatusFilter(option)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors",
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
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && !hasEmployeeData ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={`employee-skeleton-${index}`}>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
                        <div className="space-y-2">
                          <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                          <div className="bg-muted h-3 w-40 animate-pulse rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="bg-muted ml-auto h-4 w-24 animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <div className="bg-muted ml-auto h-9 w-24 animate-pulse rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.employeeId} className="group">
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" className="bg-muted/60">
                          <AvatarImage
                            src={employee.imageUrl}
                            alt={employee.fullName}
                          />
                          <AvatarFallback>
                            {getEmployeeInitials(employee.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-1">
                          <div className="truncate font-medium">
                            {employee.fullName}
                          </div>
                          <div className="text-muted-foreground truncate text-sm">
                            {employee.email}
                          </div>
                          <div className="text-muted-foreground text-xs tracking-wide uppercase">
                            {employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{formatDate(employee.joiningDate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatSalary(employee.basicSalary)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("ring-1", getStatusTone(employee.status))}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={getEmployeeDetailLink(employee.employeeId)}>
                          View Detail
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
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
                        No employees match this view
                      </div>
                      <p className="text-muted-foreground text-sm leading-6">
                        Try a different keyword or switch the status filter to
                        broaden the roster.
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
