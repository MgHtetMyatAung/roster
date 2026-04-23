import { useState } from "react";
import { Link, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTE_LINKS } from "@/constants/route.links";
import DepartmentOrgChart from "@/features/department/components/department-org-chart";
import {
  departments,
  getDepartmentMembers,
} from "@/features/department/data";

export default function DepartmentDetail() {
  const { id } = useParams();
  const department = departments.find((item) => item.id === Number(id));
  const [showTree, setShowTree] = useState(false);

  if (!department) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The department you are looking for does not exist.
          </p>
          <Button asChild variant="outline">
            <Link to={ROUTE_LINKS.DEPARTMENTS}>Back to Departments</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const members = getDepartmentMembers(department.id);
  const managerNameById = new Map(members.map((member) => [member.id, member.name]));

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {department.name}
            </h1>
            <Badge variant="outline">{department.status}</Badge>
          </div>
          <p className="text-muted-foreground">{department.description}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={ROUTE_LINKS.DEPARTMENTS}>Back to List</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Department Lead
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {department.lead}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {department.location}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Size
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {department.employees}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            {department.budget}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hiring Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Open Roles:</span> {department.openRoles}
          </p>
          <p>
            <span className="font-medium">Current Status:</span> {department.status}
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-0 max-w-full">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <CardTitle>Department Employees</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review the employee roster below or open the tree structure to see
              reporting lines.
            </p>
          </div>
          <Button
            type="button"
            variant={showTree ? "default" : "outline"}
            onClick={() => setShowTree((current) => !current)}
          >
            {showTree ? "Hide Tree Structure" : "View Tree Structure"}
          </Button>
        </CardHeader>
        <CardContent className="min-w-0 max-w-full space-y-6 overflow-hidden">
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Reports To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.team}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member.managerId
                        ? managerNameById.get(member.managerId)
                        : "No manager"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === "Active" ? "secondary" : "outline"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={showTree} onOpenChange={setShowTree}>
        <SheetContent
          side="right"
          showCloseButton
          className="data-[side=right]:w-screen data-[side=right]:max-w-none data-[side=right]:sm:max-w-none gap-0 border-l-0 p-0"
        >
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle>{department.name} Organization Structure</SheetTitle>
            <SheetDescription>
              Zoom only affects the org chart canvas. Drag inside the chart to
              move around the structure.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 p-6">
            <DepartmentOrgChart members={members} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
