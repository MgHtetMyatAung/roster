import {
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  MoveUpRight,
  ShieldCheck,
  TrendingUp,
  UserPlus2,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metrics = [
  {
    label: "Active staff",
    value: "1,284",
    change: "+6.8%",
    detail: "across all business units",
    icon: UsersRound,
    accent: "from-emerald-500/30 via-emerald-500/10 to-transparent",
  },
  {
    label: "New hires",
    value: "34",
    change: "+12%",
    detail: "joined in the last 30 days",
    icon: UserPlus2,
    accent: "from-sky-500/30 via-sky-500/10 to-transparent",
  },
  {
    label: "Payroll health",
    value: "98.4%",
    change: "On track",
    detail: "disbursement checks passed",
    icon: ShieldCheck,
    accent: "from-amber-500/30 via-amber-500/10 to-transparent",
  },
  {
    label: "Open leave",
    value: "46",
    change: "-9%",
    detail: "awaiting manager action",
    icon: CalendarRange,
    accent: "from-fuchsia-500/30 via-fuchsia-500/10 to-transparent",
  },
] as const;


export default function DashboardOverview() {
  return (
    <div className="space-y-6">

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card
              key={metric.label}
              className="relative overflow-hidden border-border/60 bg-background/90 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.4)]"
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br opacity-90",
                  metric.accent
                )}
              />
              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="mt-2 text-3xl font-semibold tracking-tight">
                      {metric.value}
                    </CardTitle>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-2.5 shadow-sm">
                    <Icon className="size-5 text-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative flex items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="size-4" />
                    {metric.change}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {metric.detail}
                  </p>
                </div>
                <MoveUpRight className="size-4 text-muted-foreground" />
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.7fr_1fr]">

        <div className="grid gap-6">
          <Card className="border-border/60 bg-background/90 shadow-[0_22px_55px_-35px_rgba(15,23,42,0.35)]">
            <CardHeader>
              <CardDescription>Today's checklist</CardDescription>
              <CardTitle>Move the highest-friction tasks first</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Approve leave requests for customer care coverage",
                "Confirm payroll export before bank cutoff",
                "Review pending contract renewals for May starters",
                "Check headcount variance in engineering squads",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3"
                >
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/90 shadow-[0_22px_55px_-35px_rgba(15,23,42,0.35)]">
            <CardHeader>
              <CardDescription>Department spotlight</CardDescription>
              <CardTitle>Operations absorbed the highest weekly load</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] bg-slate-950 p-5 text-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/75">
                      Spotlight
                    </p>
                    <p className="mt-2 text-2xl font-semibold">Ops Desk</p>
                  </div>
                  <BriefcaseBusiness className="size-6 text-cyan-200" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  Shift balancing and attendance recovery kept fulfillment
                  stable even with three simultaneous leave approvals.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Coverage", value: "96%" },
                  { label: "Overtime", value: "11h" },
                  { label: "Escalations", value: "2" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/60 bg-muted/30 p-3"
                  >
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* <section className="rounded-[32px] border border-border/60 bg-gradient-to-br from-background via-background to-muted/40 p-1 shadow-[0_24px_65px_-40px_rgba(15,23,42,0.35)]">
        <div className="rounded-[28px] border border-white/40 bg-background/95">
          <div className="flex flex-col gap-4 border-b px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Finance stream
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Transaction watchlist
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                A denser table treatment keeps finance actions anchored below
                the overview while preserving quick filtering and column
                control.
              </p>
            </div>
            <Button variant="outline" className="w-fit">
              Export current view
            </Button>
          </div>
          <div className="px-5 pb-4 pt-2">
            <DataTableDemo />
          </div>
        </div>
      </section> */}
    </div>
  );
}
