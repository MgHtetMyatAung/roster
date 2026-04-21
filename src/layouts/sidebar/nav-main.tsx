import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Activity, Fragment } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function NavMain({
  items,
}: {
  items: {
    titleKey: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      titleKey: string;
      url: string;
    }[];
  }[];
}) {
  const { t } = useTranslation("common");
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, idx) => (
          <Fragment key={idx}>
            <Activity
              mode={item.items && item.items?.length > 0 ? "visible" : "hidden"}
            >
              <Collapsible
                key={item.titleKey}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.titleKey}>
                      {item.icon && <item.icon />}
                      <span>{t(item.titleKey)}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.titleKey}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{t(subItem.titleKey)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </Activity>
            <Activity
              mode={
                !(item.items && item.items?.length > 0) ? "visible" : "hidden"
              }
            >
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{t(item.titleKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Activity>
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
