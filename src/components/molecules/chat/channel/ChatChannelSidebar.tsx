import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import ChatStatusUsers from "../ChatStatusUsers";
import ChatChannelList from "./ChatChannelList";
import ChatChannelNew from "./ChatChannelNew";

export function ChatChannelSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <ChatChannelNew />
      </SidebarHeader>
      <SidebarContent>
        <ChatChannelList />
        <ChatStatusUsers />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
