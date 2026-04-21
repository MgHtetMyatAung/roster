import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationButton() {
  return (
    <Button variant={"outline"} size="icon" className="cursor-pointer relative">
      <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums absolute -top-3 -right-2 animate-pulse bg-red-600">
        99
      </Badge>
      <Bell className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-0 scale-100" />
    </Button>
  );
}
