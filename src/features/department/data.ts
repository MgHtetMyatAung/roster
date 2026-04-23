export type Department = {
  id: number;
  name: string;
  lead: string;
  employees: number;
  openRoles: number;
  status: "Growing" | "Stable" | "Hiring";
  location: string;
  budget: string;
  description: string;
};

export type DepartmentMember = {
  id: number;
  departmentId: number;
  name: string;
  role: string;
  team: string;
  email: string;
  status: "Active" | "On Leave";
  managerId: number | null;
};

export const departments: Department[] = [
  {
    id: 1,
    name: "Engineering",
    lead: "Aye Chan",
    employees: 34,
    openRoles: 4,
    status: "Growing",
    location: "Yangon HQ",
    budget: "$420,000",
    description:
      "Builds and maintains the company's internal tools, dashboards, and customer-facing products.",
  },
  {
    id: 2,
    name: "Human Resources",
    lead: "Moe Thiri",
    employees: 8,
    openRoles: 1,
    status: "Stable",
    location: "Yangon HQ",
    budget: "$95,000",
    description:
      "Handles recruitment operations, employee engagement, onboarding, and policy administration.",
  },
  {
    id: 3,
    name: "Finance",
    lead: "Htet Min",
    employees: 12,
    openRoles: 2,
    status: "Hiring",
    location: "Mandalay Office",
    budget: "$160,000",
    description:
      "Owns payroll, forecasting, compliance, and financial planning across the organization.",
  },
  {
    id: 4,
    name: "Operations",
    lead: "Su Mon",
    employees: 19,
    openRoles: 0,
    status: "Stable",
    location: "Naypyidaw Hub",
    budget: "$210,000",
    description:
      "Coordinates facilities, procurement, logistics, and day-to-day support for every business unit.",
  },
];

export const departmentMembers: DepartmentMember[] = [
  {
    id: 101,
    departmentId: 1,
    name: "Aye Chan",
    role: "VP Engineering",
    team: "Leadership",
    email: "aye.chan@roster.local",
    status: "Active",
    managerId: null,
  },
  {
    id: 102,
    departmentId: 1,
    name: "Min Thant",
    role: "Engineering Manager",
    team: "Platform",
    email: "min.thant@roster.local",
    status: "Active",
    managerId: 101,
  },
  {
    id: 103,
    departmentId: 1,
    name: "Ei Mon",
    role: "Engineering Manager",
    team: "Product",
    email: "ei.mon@roster.local",
    status: "Active",
    managerId: 101,
  },
  {
    id: 104,
    departmentId: 1,
    name: "Kaung Sett",
    role: "DevOps Lead",
    team: "Infrastructure",
    email: "kaung.sett@roster.local",
    status: "Active",
    managerId: 101,
  },
  {
    id: 105,
    departmentId: 1,
    name: "Nandar Win",
    role: "Senior Frontend Engineer",
    team: "Product",
    email: "nandar.win@roster.local",
    status: "Active",
    managerId: 103,
  },
  {
    id: 106,
    departmentId: 1,
    name: "Zaw Oo",
    role: "Backend Engineer",
    team: "Platform",
    email: "zaw.oo@roster.local",
    status: "Active",
    managerId: 102,
  },
  {
    id: 107,
    departmentId: 1,
    name: "Thiri Aung",
    role: "QA Engineer",
    team: "Platform",
    email: "thiri.aung@roster.local",
    status: "On Leave",
    managerId: 102,
  },
  {
    id: 108,
    departmentId: 1,
    name: "Myo Htet",
    role: "Site Reliability Engineer",
    team: "Infrastructure",
    email: "myo.htet@roster.local",
    status: "Active",
    managerId: 104,
  },
  {
    id: 201,
    departmentId: 2,
    name: "Moe Thiri",
    role: "HR Director",
    team: "Leadership",
    email: "moe.thiri@roster.local",
    status: "Active",
    managerId: null,
  },
  {
    id: 202,
    departmentId: 2,
    name: "Su Wai",
    role: "Talent Acquisition Manager",
    team: "Recruiting",
    email: "su.wai@roster.local",
    status: "Active",
    managerId: 201,
  },
  {
    id: 203,
    departmentId: 2,
    name: "Kyaw Zin",
    role: "People Operations Lead",
    team: "People Ops",
    email: "kyaw.zin@roster.local",
    status: "Active",
    managerId: 201,
  },
  {
    id: 204,
    departmentId: 2,
    name: "Nan Khin",
    role: "Recruiter",
    team: "Recruiting",
    email: "nan.khin@roster.local",
    status: "Active",
    managerId: 202,
  },
  {
    id: 205,
    departmentId: 2,
    name: "Htut Htet",
    role: "HR Specialist",
    team: "People Ops",
    email: "htut.htet@roster.local",
    status: "Active",
    managerId: 203,
  },
  {
    id: 301,
    departmentId: 3,
    name: "Htet Min",
    role: "Finance Director",
    team: "Leadership",
    email: "htet.min@roster.local",
    status: "Active",
    managerId: null,
  },
  {
    id: 302,
    departmentId: 3,
    name: "May Thazin",
    role: "Accounting Lead",
    team: "Accounting",
    email: "may.thazin@roster.local",
    status: "Active",
    managerId: 301,
  },
  {
    id: 303,
    departmentId: 3,
    name: "Phyo Khant",
    role: "Payroll Manager",
    team: "Payroll",
    email: "phyo.khant@roster.local",
    status: "Active",
    managerId: 301,
  },
  {
    id: 304,
    departmentId: 3,
    name: "Kyi Mon",
    role: "Financial Analyst",
    team: "Planning",
    email: "kyi.mon@roster.local",
    status: "Active",
    managerId: 301,
  },
  {
    id: 401,
    departmentId: 4,
    name: "Su Mon",
    role: "Operations Director",
    team: "Leadership",
    email: "su.mon@roster.local",
    status: "Active",
    managerId: null,
  },
  {
    id: 402,
    departmentId: 4,
    name: "Thiha Linn",
    role: "Facilities Manager",
    team: "Facilities",
    email: "thiha.linn@roster.local",
    status: "Active",
    managerId: 401,
  },
  {
    id: 403,
    departmentId: 4,
    name: "Sanda Moe",
    role: "Procurement Lead",
    team: "Procurement",
    email: "sanda.moe@roster.local",
    status: "Active",
    managerId: 401,
  },
  {
    id: 404,
    departmentId: 4,
    name: "Ye Naing",
    role: "Logistics Coordinator",
    team: "Logistics",
    email: "ye.naing@roster.local",
    status: "Active",
    managerId: 401,
  },
];

export function getDepartmentMembers(departmentId: number) {
  return departmentMembers.filter((member) => member.departmentId === departmentId);
}
