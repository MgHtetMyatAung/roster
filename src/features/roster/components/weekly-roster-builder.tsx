import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Clock,
  Eraser,
  Filter,
  Plus,
  Rocket,
  Save,
  Sparkles,
  UsersRound,
} from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { employeeDemoData } from "@/features/employee/data";
import type { EmployeeType } from "@/features/employee/type";
import { cn } from "@/lib/utils";

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const WEEK_DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

type DayKey = (typeof WEEK_DAYS)[number]["key"];
type CardType = "shift" | "off";
type OffCode = "VAC" | "PH OFF" | "Weekly Off" | "Monthly Off";
type RosterStatus = "Planning" | "Draft saved" | "Published";

type RosterCard = {
  id: string;
  day: DayKey;
  type: CardType;
  title: string;
  startTime: string;
  endTime: string;
  offCode?: OffCode;
  deductBalance: boolean;
  color: ColorValue;
  assignedEmployeeIds: string[];
};

const COLOR_OPTIONS = [
  {
    value: "blue",
    label: "Blue",
    swatchClass: "bg-blue-500",
    cardClass:
      "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
  },
  {
    value: "emerald",
    label: "Emerald",
    swatchClass: "bg-emerald-500",
    cardClass:
      "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
  },
  {
    value: "amber",
    label: "Amber",
    swatchClass: "bg-amber-500",
    cardClass:
      "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
  },
  {
    value: "rose",
    label: "Rose",
    swatchClass: "bg-rose-500",
    cardClass:
      "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
  },
  {
    value: "slate",
    label: "Slate",
    swatchClass: "bg-slate-500",
    cardClass:
      "border-slate-200 bg-slate-50 text-slate-950 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-100",
  },
] as const;

type ColorValue = (typeof COLOR_OPTIONS)[number]["value"];

const OFF_CODES: OffCode[] = ["VAC", "PH OFF", "Weekly Off", "Monthly Off"];

const TEMPLATE_CARDS: Omit<RosterCard, "id" | "day" | "assignedEmployeeIds">[] = [
  {
    type: "shift",
    title: "Morning",
    startTime: "07:00",
    endTime: "15:00",
    deductBalance: false,
    color: "blue",
  },
  {
    type: "shift",
    title: "Evening",
    startTime: "15:00",
    endTime: "23:00",
    deductBalance: false,
    color: "emerald",
  },
  {
    type: "off",
    title: "Weekly Off",
    startTime: "",
    endTime: "",
    offCode: "Weekly Off",
    deductBalance: false,
    color: "slate",
  },
];

function getWeekStart(date: Date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function formatWeekRange(weekStart: Date) {
  return `${dayFormatter.format(weekStart)} - ${fullDateFormatter.format(
    addDays(weekStart, 6),
  )}`;
}

function getWeekKey(weekStart: Date) {
  return weekStart.toISOString().slice(0, 10);
}

function getEmployeeInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getColorOption(color: ColorValue) {
  return COLOR_OPTIONS.find((option) => option.value === color) ?? COLOR_OPTIONS[0];
}

function createCard(
  day: DayKey,
  template: Omit<RosterCard, "id" | "day" | "assignedEmployeeIds">,
  assignedEmployeeIds: string[] = [],
): RosterCard {
  return {
    ...template,
    id: `${day}-${template.title.toLowerCase().replace(/\s+/g, "-")}-${crypto.randomUUID()}`,
    day,
    assignedEmployeeIds,
  };
}

function buildAutoRoster(employees: EmployeeType[]) {
  return WEEK_DAYS.flatMap((day, dayIndex) => {
    const workingEmployees = employees.filter((_, index) => (index + dayIndex) % 6 !== 0);
    const offEmployees = employees.filter((_, index) => (index + dayIndex) % 6 === 0);
    const midpoint = Math.ceil(workingEmployees.length / 2);

    return [
      createCard(day.key, TEMPLATE_CARDS[0], workingEmployees.slice(0, midpoint).map((employee) => employee.employeeId)),
      createCard(day.key, TEMPLATE_CARDS[1], workingEmployees.slice(midpoint).map((employee) => employee.employeeId)),
      createCard(day.key, TEMPLATE_CARDS[2], offEmployees.map((employee) => employee.employeeId)),
    ];
  });
}

function buildEmptyRoster(weekKey = "empty") {
  return WEEK_DAYS.flatMap((day) =>
    TEMPLATE_CARDS.map((template) => {
      const card = createCard(day.key, template);

      return {
        ...card,
        id: `${weekKey}-${card.id}`,
      };
    }),
  );
}

function buildCopiedRoster(employees: EmployeeType[]) {
  return WEEK_DAYS.flatMap((day, dayIndex) => {
    const firstGroup = employees.filter((_, index) => index % 3 === dayIndex % 3);
    const secondGroup = employees.filter((_, index) => index % 3 !== dayIndex % 3);

    return [
      createCard(day.key, TEMPLATE_CARDS[0], firstGroup.map((employee) => employee.employeeId)),
      createCard(day.key, TEMPLATE_CARDS[1], secondGroup.slice(0, 5).map((employee) => employee.employeeId)),
      createCard(day.key, {
        type: "off",
        title: dayIndex === 6 ? "Weekly Off" : "VAC",
        startTime: "",
        endTime: "",
        offCode: dayIndex === 6 ? "Weekly Off" : "VAC",
        deductBalance: dayIndex !== 6,
        color: dayIndex === 6 ? "slate" : "amber",
      }, secondGroup.slice(5).map((employee) => employee.employeeId)),
    ];
  });
}

function getCardHours(card: RosterCard) {
  if (card.type === "off") {
    return 0;
  }

  const [startHour, startMinute] = card.startTime.split(":").map(Number);
  const [endHour, endMinute] = card.endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  return Math.max(end - start, 0) / 60;
}

function getCardMeta(card: RosterCard) {
  if (card.type === "off") {
    return card.deductBalance ? "Deduct balance" : "No deduction";
  }

  return `${card.startTime} - ${card.endTime}`;
}

function EmptyAvatarStack() {
  return (
    <div className="flex h-8 max-w-full items-center justify-center rounded-full border border-dashed border-border bg-background/45 px-3 text-xs font-medium text-muted-foreground">
      Assign employees
    </div>
  );
}

function AvatarStack({
  employees,
  max = 4,
}: {
  employees: EmployeeType[];
  max?: number;
}) {
  if (employees.length === 0) {
    return <EmptyAvatarStack />;
  }

  const visibleEmployees = employees.slice(0, max);
  const hiddenCount = employees.length - visibleEmployees.length;

  return (
    <div className="flex max-w-full items-center overflow-hidden py-0.5">
      {visibleEmployees.map((employee, index) => (
        <Avatar
          key={employee.employeeId}
          size="sm"
          className={cn(
            "border-2 border-background shadow-sm ring-1 ring-black/5",
            index > 0 && "-ml-1.5",
          )}
        >
          <AvatarImage src={employee.imageUrl} alt={employee.fullName} />
          <AvatarFallback>{getEmployeeInitials(employee.fullName)}</AvatarFallback>
        </Avatar>
      ))}
      {hiddenCount > 0 && (
        <div className="-ml-1.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-background bg-foreground text-[10px] font-semibold text-background">
          +{hiddenCount}
        </div>
      )}
    </div>
  );
}

export default function WeeklyRosterBuilder() {
  const activeEmployees = useMemo(
    () => employeeDemoData.filter((employee) => employee.status === "Active"),
    [],
  );
  const departments = useMemo(
    () => Array.from(new Set(activeEmployees.map((employee) => employee.department))),
    [activeEmployees],
  );

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const currentWeekKey = useMemo(() => getWeekKey(getWeekStart(new Date())), []);
  const selectedWeekKey = useMemo(() => getWeekKey(weekStart), [weekStart]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [cardsByWeek, setCardsByWeek] = useState<Record<string, RosterCard[]>>(
    () => ({
      [currentWeekKey]: buildAutoRoster(activeEmployees),
    }),
  );
  const [rosterStatus, setRosterStatus] = useState<RosterStatus>("Planning");
  const [statusDetail, setStatusDetail] = useState("Shift cards are ready for review");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [draftCard, setDraftCard] = useState<RosterCard | null>(null);

  const filteredEmployees = useMemo(() => {
    if (departmentFilter === "all") {
      return activeEmployees;
    }

    return activeEmployees.filter(
      (employee) => employee.department === departmentFilter,
    );
  }, [activeEmployees, departmentFilter]);

  const employeeById = useMemo(
    () =>
      Object.fromEntries(
        activeEmployees.map((employee) => [employee.employeeId, employee]),
      ) as Record<string, EmployeeType>,
    [activeEmployees],
  );

  const visibleEmployeeIds = useMemo(
    () => new Set(filteredEmployees.map((employee) => employee.employeeId)),
    [filteredEmployees],
  );

  const emptyWeekCards = useMemo(
    () => buildEmptyRoster(selectedWeekKey),
    [selectedWeekKey],
  );
  const cards = cardsByWeek[selectedWeekKey] ?? emptyWeekCards;

  function updateSelectedWeekCards(
    updater: RosterCard[] | ((currentCards: RosterCard[]) => RosterCard[]),
  ) {
    setCardsByWeek((currentCardsByWeek) => {
      const currentCards = currentCardsByWeek[selectedWeekKey] ?? cards;

      return {
        ...currentCardsByWeek,
        [selectedWeekKey]:
          typeof updater === "function" ? updater(currentCards) : updater,
      };
    });
  }

  const visibleCards = cards
    .map((card) => ({
      ...card,
      assignedEmployeeIds: card.assignedEmployeeIds.filter((employeeId) =>
        visibleEmployeeIds.has(employeeId),
      ),
    }))
    .filter((card) => departmentFilter === "all" || card.assignedEmployeeIds.length > 0);

  const assignedCount = visibleCards.reduce(
    (total, card) => total + card.assignedEmployeeIds.length,
    0,
  );
  const scheduledHours = visibleCards.reduce(
    (total, card) => total + getCardHours(card) * card.assignedEmployeeIds.length,
    0,
  );
  const offCardCount = visibleCards.filter((card) => card.type === "off").length;

  function openEditor(card: RosterCard) {
    setEditingCardId(card.id);
    setDraftCard(card);
  }

  function addShiftCard(day: DayKey) {
    const newCard = createCard(day, {
      type: "shift",
      title: "New Shift",
      startTime: "09:00",
      endTime: "17:00",
      deductBalance: false,
      color: "blue",
    });

    updateSelectedWeekCards((currentCards) => [...currentCards, newCard]);
    setRosterStatus("Planning");
    setStatusDetail("Added a new editable shift card");
    openEditor(newCard);
  }

  function saveDraftCard() {
    if (!draftCard || !editingCardId) {
      return;
    }

    updateSelectedWeekCards((currentCards) =>
      currentCards.map((card) => (card.id === editingCardId ? draftCard : card)),
    );
    setRosterStatus("Planning");
    setStatusDetail("Roster has unpublished card edits");
    setEditingCardId(null);
    setDraftCard(null);
  }

  function removeDraftCard() {
    if (!editingCardId) {
      return;
    }

    updateSelectedWeekCards((currentCards) =>
      currentCards.filter((card) => card.id !== editingCardId),
    );
    setRosterStatus("Planning");
    setStatusDetail("Removed a roster card");
    setEditingCardId(null);
    setDraftCard(null);
  }

  function toggleDraftEmployee(employeeId: string) {
    if (!draftCard) {
      return;
    }

    setDraftCard({
      ...draftCard,
      assignedEmployeeIds: draftCard.assignedEmployeeIds.includes(employeeId)
        ? draftCard.assignedEmployeeIds.filter((id) => id !== employeeId)
        : [...draftCard.assignedEmployeeIds, employeeId],
    });
  }

  function handleAutoFill() {
    updateSelectedWeekCards(buildAutoRoster(filteredEmployees));
    setRosterStatus("Planning");
    setStatusDetail(`Auto-filled shift cards for ${filteredEmployees.length} employees`);
  }

  function handleCopyPreviousWeek() {
    updateSelectedWeekCards(buildCopiedRoster(filteredEmployees));
    setRosterStatus("Draft saved");
    setStatusDetail("Copied previous week card pattern into this roster");
  }

  function handleClearRoster() {
    updateSelectedWeekCards((currentCards) =>
      currentCards.map((card) => ({
        ...card,
        assignedEmployeeIds: card.assignedEmployeeIds.filter(
          (employeeId) => !visibleEmployeeIds.has(employeeId),
        ),
      })),
    );
    setRosterStatus("Planning");
    setStatusDetail("Cleared assignments from visible cards");
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/60 overflow-hidden bg-gradient-to-br from-background via-background to-muted/40">
        <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge
              variant="outline"
              className="border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em]"
            >
              Weekly Roster Builder
            </Badge>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Build shifts first, then assign people
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6">
                Each day contains editable shift and off-day cards. Add one or
                many employees to every card without scanning a long employee table.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setRosterStatus("Draft saved");
                setStatusDetail(`Draft saved for ${formatWeekRange(weekStart)}`);
              }}
            >
              <Save className="size-4" />
              Save draft
            </Button>
            <Button
              onClick={() => {
                setRosterStatus("Published");
                setStatusDetail(`Published roster for ${formatWeekRange(weekStart)}`);
              }}
            >
              <Rocket className="size-4" />
              Publish roster
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Assigned people",
            value: assignedCount.toString().padStart(2, "0"),
            description: `${filteredEmployees.length} employees in current filter`,
            icon: UsersRound,
          },
          {
            title: "Shift cards",
            value: visibleCards.length.toString().padStart(2, "0"),
            description: "Cards across the visible week",
            icon: CalendarDays,
          },
          {
            title: "Coverage hours",
            value: scheduledHours.toFixed(0),
            description: "Total assigned shift hours",
            icon: Clock,
          },
          {
            title: rosterStatus,
            value: offCardCount.toString().padStart(2, "0"),
            description: "Off-day cards in view",
            icon: Sparkles,
          },
        ].map((item) => (
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

      <div className="rounded-xl border border-border/70 bg-background shadow-sm">
        <div className="space-y-3 p-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="flex h-10 min-w-0 items-center rounded-lg border bg-muted/25">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Previous week"
                onClick={() => setWeekStart((current) => addDays(current, -7))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="min-w-0 border-x px-3 md:min-w-[240px]">
                <div className="truncate text-sm font-semibold">
                  {formatWeekRange(weekStart)}
                </div>
                <div className="text-muted-foreground truncate text-xs">
                  {statusDetail}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Next week"
                onClick={() => setWeekStart((current) => addDays(current, 7))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => setWeekStart(getWeekStart(new Date()))}
            >
              <CalendarDays className="size-4" />
              This week
            </Button>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="h-10 min-w-[220px] rounded-lg">
                <span className="flex items-center gap-2">
                  <Filter className="text-muted-foreground size-4" />
                  <SelectValue placeholder="Department" />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className={cn(
                "h-10 rounded-lg px-4",
                rosterStatus === "Published" &&
                  "border-emerald-200 bg-emerald-500/10 text-emerald-700",
                rosterStatus === "Draft saved" &&
                  "border-blue-200 bg-blue-500/10 text-blue-700",
              )}
            >
              {rosterStatus}
            </Badge>
            <Button variant="secondary" className="h-10" onClick={handleAutoFill}>
              <Sparkles className="size-4" />
              Auto-fill
            </Button>
            <Button
              variant="outline"
              className="h-10"
              onClick={handleCopyPreviousWeek}
            >
              <ClipboardCopy className="size-4" />
              Copy previous
            </Button>
            <Button variant="ghost" className="h-10" onClick={handleClearRoster}>
              <Eraser className="size-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="grid min-w-max grid-cols-7 gap-4">
          {WEEK_DAYS.map((day, index) => {
            const dayCards = visibleCards.filter((card) => card.day === day.key);
            const dayAssignedCount = dayCards.reduce(
              (total, card) => total + card.assignedEmployeeIds.length,
              0,
            );

            return (
              <section
                key={day.key}
                className="min-h-[560px] w-[268px] overflow-hidden rounded-xl border border-border/70 bg-muted/20 shadow-sm"
              >
                <div className="border-b bg-background/90 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{day.label}</h2>
                      <p className="text-muted-foreground text-xs">
                        {dayFormatter.format(addDays(weekStart, index))}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Add ${day.label} shift`}
                      onClick={() => addShiftCard(day.key)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/55 px-2.5 py-2 text-xs">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-medium">{dayAssignedCount} assigned</span>
                  </div>
                </div>

                <div className="space-y-3 p-3">
                  {dayCards.map((card) => {
                    const colorOption = getColorOption(card.color);
                    const assignedEmployees = card.assignedEmployeeIds
                      .map((employeeId) => employeeById[employeeId])
                      .filter(Boolean);

                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => openEditor(card)}
                        className={cn(
                          "w-full overflow-hidden rounded-xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                          colorOption.cardClass,
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold">
                              {card.title}
                            </div>
                            <div className="mt-1 text-xs font-medium opacity-75">
                              {getCardMeta(card)}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "mt-1 size-2.5 shrink-0 rounded-full",
                              colorOption.swatchClass,
                            )}
                          />
                        </div>
                        <div className="mt-4 rounded-lg bg-background/45 p-2">
                          <AvatarStack employees={assignedEmployees} />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <span className="rounded-md bg-background/45 px-2 py-1.5 font-medium">
                            {assignedEmployees.length} people
                          </span>
                          <span className="rounded-md bg-background/45 px-2 py-1.5 text-right font-medium">
                            {card.type === "shift" ? "Shift" : card.offCode}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Sheet
        open={Boolean(editingCardId)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCardId(null);
            setDraftCard(null);
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="border-b">
            <SheetTitle>Edit roster card</SheetTitle>
            <SheetDescription>
              Assign multiple employees to this shift or off-day card.
            </SheetDescription>
          </SheetHeader>

          {draftCard && (
            <div className="space-y-5 px-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Card type</Label>
                  <Select
                    value={draftCard.type}
                    onValueChange={(value) =>
                      setDraftCard({
                        ...draftCard,
                        type: value as CardType,
                        title: value === "off" ? "Weekly Off" : "New Shift",
                        offCode: value === "off" ? "Weekly Off" : undefined,
                        color: value === "off" ? "slate" : "blue",
                      })
                    }
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shift">Shift</SelectItem>
                      <SelectItem value="off">Off day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-title">Label</Label>
                  <Input
                    id="card-title"
                    value={draftCard.title}
                    onChange={(event) =>
                      setDraftCard({ ...draftCard, title: event.target.value })
                    }
                  />
                </div>
              </div>

              {draftCard.type === "shift" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="start-time">Start time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={draftCard.startTime}
                      onChange={(event) =>
                        setDraftCard({ ...draftCard, startTime: event.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-time">End time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={draftCard.endTime}
                      onChange={(event) =>
                        setDraftCard({ ...draftCard, endTime: event.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Off day code</Label>
                    <Select
                      value={draftCard.offCode}
                      onValueChange={(value) =>
                        setDraftCard({
                          ...draftCard,
                          title: value,
                          offCode: value as OffCode,
                          deductBalance: value === "VAC",
                          color: value === "VAC" ? "amber" : "slate",
                        })
                      }
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Select off day" />
                      </SelectTrigger>
                      <SelectContent>
                        {OFF_CODES.map((code) => (
                          <SelectItem key={code} value={code}>
                            {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <label className="flex items-start gap-3 rounded-xl border p-3 text-sm">
                    <Checkbox
                      checked={draftCard.deductBalance}
                      onCheckedChange={(checked) =>
                        setDraftCard({
                          ...draftCard,
                          deductBalance: checked === true,
                        })
                      }
                    />
                    <span>
                      <span className="block font-medium">
                        Deduct from employee balance
                      </span>
                      <span className="text-muted-foreground block">
                        Useful for vacation and balance-tracked off days.
                      </span>
                    </span>
                  </label>
                </div>
              )}

              <div className="grid gap-2">
                <Label>Color tag</Label>
                <Select
                  value={draftCard.color}
                  onValueChange={(value) =>
                    setDraftCard({ ...draftCard, color: value as ColorValue })
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span
                            className={cn("size-2 rounded-full", option.swatchClass)}
                          />
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Assign employees</Label>
                  <Badge variant="outline">
                    {draftCard.assignedEmployeeIds.length} selected
                  </Badge>
                </div>
                <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
                  {filteredEmployees.map((employee) => {
                    const isSelected = draftCard.assignedEmployeeIds.includes(
                      employee.employeeId,
                    );

                    return (
                      <label
                        key={employee.employeeId}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition hover:bg-muted/40",
                          isSelected && "border-primary/40 bg-primary/5",
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleDraftEmployee(employee.employeeId)}
                        />
                        <Avatar className="bg-muted/60">
                          <AvatarImage src={employee.imageUrl} alt={employee.fullName} />
                          <AvatarFallback>
                            {getEmployeeInitials(employee.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {employee.fullName}
                          </span>
                          <span className="text-muted-foreground block truncate text-xs">
                            {employee.position} - {employee.department}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="border-t sm:flex-row sm:justify-between">
            <Button type="button" variant="destructive" onClick={removeDraftCard}>
              Remove card
            </Button>
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="button" onClick={saveDraftCard}>
                Save card
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
