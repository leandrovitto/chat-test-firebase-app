import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";

const ChatHeader = () => {
  return (
    <header className="flex h-10 text-xs items-center gap-2 border-b px-2">
      <SidebarTrigger className="-ml-1" />
      ChatHeader
    </header>
  );
};

export default ChatHeader;
