import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function SettingButton() {
  return (
    <Button variant={"outline"} size="icon" className="cursor-pointer relative">
      <Settings className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 rotate-0 scale-100" />
    </Button>
  );
}
