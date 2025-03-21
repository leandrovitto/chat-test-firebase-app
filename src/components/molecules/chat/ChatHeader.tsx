import { SidebarTrigger } from "@/components/ui/sidebar";
import { Channel } from "@/lib/firebase/firestore/channel.firestore";

interface ChatHeaderProps {
  channel: Channel;
}

const ChatHeader = ({ channel }: ChatHeaderProps) => {
  return (
    <header className="flex h-10 text-xs items-center gap-2 border-b px-2">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center gap-1 ">
          <p className="text-sm">#{channel.name}</p>
          <p className="text-xs text-gray-200 truncate">{channel?.id}</p>
        </div>

        {channel?.description && (
          <p className="text-xs text-gray-500 truncate">
            {channel?.description}
          </p>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
