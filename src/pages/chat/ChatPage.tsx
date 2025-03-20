import { ChatChannelSidebar } from "@/components/molecules/chat/channel/ChatChannelSidebar";
import Chat from "@/components/molecules/chat/Chat";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const ChatPage = () => {
  return (
    <SidebarProvider>
      <ChatChannelSidebar variant="sidebar" collapsible="icon" />
      <SidebarInset>
        <Chat />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatPage;
