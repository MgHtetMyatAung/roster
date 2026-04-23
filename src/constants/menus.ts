import {
  AudioWaveform,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Building2,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PictureInPicture2,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { ROUTE_LINKS } from "./route.links";

export const MENUS = {
  user: {
    nameKey: "user.name",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      nameKey: "teams.acmeInc",
      logo: GalleryVerticalEnd,
      planKey: "plans.enterprise",
    },
    {
      nameKey: "teams.acmeCorp",
      logo: AudioWaveform,
      planKey: "plans.startup",
    },
    {
      nameKey: "teams.evilCorp",
      logo: Command,
      planKey: "plans.free",
    },
  ],

  navMain: [
    {
      titleKey: "menu.dashboard",
      url: ROUTE_LINKS.DASHBOARD,
      icon: SquareTerminal,
      isActive: true,
      item: [],
    },
    {
      titleKey: "menu.employees",
      icon: Bot,
      url: "#",
      isActive: false,
      items: [
        { titleKey: "menu.list", url: ROUTE_LINKS.EMPLOYEE },
        { titleKey: "menu.create", url: ROUTE_LINKS.CREATE_EMPLOYEE },
        { titleKey: "menu.leave", url: ROUTE_LINKS.EMPLOYEE_LEAVE },
      ],
    },
    {
      titleKey: "menu.projects",
      icon: BookOpen,
      url: "#",
      isActive: false,
      items: [
        { titleKey: "menu.introduction", url: "#" },
        { titleKey: "menu.getStarted", url: "#" },
        { titleKey: "menu.tutorials", url: "#" },
        { titleKey: "menu.changelog", url: "#" },
      ],
    },
    {
      titleKey: "menu.payroll",
      icon: Settings2,
      url: ROUTE_LINKS.PAYROLL,
      isActive: false,
      item: [],
    },
    {
      titleKey: "menu.departments",
      icon: Building2,
      url: "#",
      isActive: false,
      items: [
        { titleKey: "menu.list", url: ROUTE_LINKS.DEPARTMENTS },
        { titleKey: "menu.create", url: ROUTE_LINKS.CREATE_DEPARTMENT },
      ],
    },
    {
      titleKey: "menu.hiring",
      icon: Settings2,
      url: "#",
      isActive: false,
      item: [],
    },
    {
      titleKey: "menu.meetingRooms",
      icon: PictureInPicture2,
      url: "#",
      isActive: false,
      item: [],
    },
    {
      titleKey: "menu.recruitment",
      icon: BriefcaseBusiness,
      url: "#",
      isActive: false,
      items: [
        { titleKey: "menu.list", url: ROUTE_LINKS.RECRUITMENT },
        { titleKey: "menu.create", url: ROUTE_LINKS.CREATE_RECRUITMENT },
        {
          titleKey: "menu.candidates",
          url: ROUTE_LINKS.RECRUITMENT_CANDIDATES,
        },
      ],
    },
    {
      titleKey: "menu.aiInsights",
      icon: SquareTerminal,
      url: "#",
      isActive: false,
      item: [],
    },
  ],

  projects: [
    {
      nameKey: "projects.designEngineering",
      url: "#",
      icon: Frame,
    },
    {
      nameKey: "projects.salesMarketing",
      url: "#",
      icon: PieChart,
    },
    {
      nameKey: "projects.travel",
      url: "#",
      icon: Map,
    },
  ],
};
