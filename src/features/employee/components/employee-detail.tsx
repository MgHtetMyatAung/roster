import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
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
import { ROUTE_LINKS } from "@/constants/route.links";
import { employeeDemoData } from "@/features/employee/data";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-US");

function getEmployeeInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatSalary(amount: number) {
  return `${currencyFormatter.format(amount)} MMK`;
}

function getStatusTone(status: string) {
  return status === "Active"
    ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/20"
    : "bg-amber-500/12 text-amber-700 ring-amber-500/20";
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetEmployeesQuery();
  const hasEmployeeData = Array.isArray(data) && data.length > 0;
  const employees = hasEmployeeData ? data : employeeDemoData;
  const employee = employees.find((item) => item.employeeId === id);

  if (isLoading && !hasEmployeeData) {
    return (
      <div className="space-y-6">
        <Card className="border-border/60">
          <CardHeader>
            <div className="bg-muted h-6 w-56 animate-pulse rounded" />
            <div className="bg-muted h-4 w-72 animate-pulse rounded" />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`employee-detail-skeleton-${index}`}
                className="bg-muted/60 h-28 animate-pulse rounded-xl"
              />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!employee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Employee Not Found</CardTitle>
          <CardDescription>
            The profile you are trying to open is not available in the current
            roster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to={ROUTE_LINKS.EMPLOYEE}>Back to Employee List</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const tenureYears = Math.max(
    0,
    (new Date().getTime() - new Date(employee.joiningDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365),
  );

  const statCards = [
    {
      title: "Department",
      value: employee.department,
      description: "Current team assignment",
      icon: BriefcaseBusiness,
    },
    {
      title: "Position",
      value: employee.position,
      description: "Primary role on record",
      icon: UserRound,
    },
    {
      title: "Monthly Salary",
      value: formatSalary(employee.basicSalary),
      description: "Base payroll amount",
      icon: CircleDollarSign,
    },
    {
      title: "Tenure",
      value: `${tenureYears.toFixed(1)} years`,
      description: `Joined on ${formatDate(employee.joiningDate)}`,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-gradient-to-br from-background via-background to-muted/40">
        <CardHeader className="gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Avatar size="lg" className="bg-muted/60">
              <AvatarImage src={employee.imageUrl} alt={employee.fullName} />
              <AvatarFallback>{getEmployeeInitials(employee.fullName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  {employee.fullName}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn("ring-1", getStatusTone(employee.status))}
                >
                  {employee.status}
                </Badge>
              </div>
              <CardDescription className="text-base">
                {employee.position} in {employee.department}
              </CardDescription>
              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <span>{employee.employeeId}</span>
                <span>{employee.email}</span>
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to={ROUTE_LINKS.EMPLOYEE}>
              <ArrowLeft className="size-4" />
              Back to List
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.title} className="border-border/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div className="space-y-1">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-xl font-semibold">
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

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Profile overview</CardTitle>
            <CardDescription>
              A concise operational snapshot for managers and HR partners.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Work Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Phone Number</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Position</p>
                <p className="font-medium">{employee.position}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Joining Date</p>
                <p className="font-medium">{formatDate(employee.joiningDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Contact and compliance</CardTitle>
            <CardDescription>
              Useful details for day-to-day coordination and roster verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/40 flex items-start gap-3 rounded-2xl p-4">
              <div className="bg-background flex size-10 items-center justify-center rounded-xl">
                <Mail className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Primary Email</p>
                <p className="text-muted-foreground text-sm">{employee.email}</p>
              </div>
            </div>
            <div className="bg-muted/40 flex items-start gap-3 rounded-2xl p-4">
              <div className="bg-background flex size-10 items-center justify-center rounded-xl">
                <Phone className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Direct Contact</p>
                <p className="text-muted-foreground text-sm">{employee.phone}</p>
              </div>
            </div>
            <div className="bg-muted/40 flex items-start gap-3 rounded-2xl p-4">
              <div className="bg-background flex size-10 items-center justify-center rounded-xl">
                <ShieldCheck className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Employment Status</p>
                <p className="text-muted-foreground text-sm">
                  {employee.status} and listed in the current employee roster.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
