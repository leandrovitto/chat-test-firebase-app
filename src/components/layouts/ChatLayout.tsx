import { ChatChannelSidebar } from "@/components/molecules/chat/channel/ChatChannelSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

const ChatLayout = () => {
  return (
    <SidebarProvider>
      <ChatChannelSidebar variant="sidebar" collapsible="icon" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatLayout;
