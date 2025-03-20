import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";

const ChatHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      ChatHeader
    </header>
  );
};

export default ChatHeader;
