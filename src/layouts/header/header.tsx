import { LanguageToggle } from "@/components/common/lang-switch";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationButton from "@/features/notification/components/notification-btn";
import SettingButton from "@/features/setting/components/setting-btn";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center justify-between px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <div className=" flex items-center gap-3">
          <LanguageToggle />
          <SettingButton />
          <NotificationButton />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
