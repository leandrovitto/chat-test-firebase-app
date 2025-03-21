import * as React from "react";
import { PresenceContext } from "@/provider/PresenceProvider";
import { useContext } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import ChatChannelList from "./ChatChannelList";
import ChatChannelNew from "./ChatChannelNew";
import ChatStatusUsers from "../ChatStatusUsers";

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
