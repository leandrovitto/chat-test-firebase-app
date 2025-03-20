import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Channel,
  deleteChannel,
  getChannels,
} from "@/lib/firebase/firestore/channel.firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { Tooltip } from "@radix-ui/react-tooltip";
import { HomeIcon, TrashIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
type Props = {};

const ChatChannelList = (_props: Props) => {
  const navigate = useNavigate(); // Initialize router
  const { open } = useSidebar();
  const { user } = useContext(AuthContext) as AuthContextType;

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
    navigate(`/chat/${channel.id}`); // Navigate to the channel-specific route
  };

  const handleDeleteChannel = (channel: Channel) => {
    if (channel?.id && user?.uid) {
      if (confirm("Are you sure you want to delete this channel?")) {
        setLoadingDelete(true);
        deleteChannel(channel.id, user.uid)
          .then(() => {
            navigate("/chat");
            console.log("Channel deleted successfully");
            toast("Channel deleted successfully");
          })
          .catch((error) => {
            setLoadingDelete(false);
            console.error("Error deleting channel", error);
          });
      }
    } else {
      console.error("User ID is undefined. Cannot delete channel.");
    }
  };

  const isMyChannel = (channel: Channel) => {
    return channel.createdBy === user?.uid;
  };

  // Carica canali
  useEffect(() => {
    setLoading(true);
    const unsubscribe = getChannels((chs) => {
      setChannels(chs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentChannel]);

  if (loading) {
    return (
      <div className="flex-grow overflow-y-auto">
        <p className="text-gray-500 text-center text-xs p-4">
          Loading channels...
        </p>
      </div>
    );
  }

  if (loadingDelete) {
    return (
      <div className="flex-grow overflow-y-auto">
        <p className="text-gray-500 text-center p-4">Deleting channel...</p>
      </div>
    );
  }

  return (
    <div>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuButton>
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => navigate("/chat")}
              >
                {open && (
                  <div className="flex justify-between items-center gap-2">
                    <HomeIcon size={20} />
                    <div>Chat Home</div>
                  </div>
                )}
                {!open && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <HomeIcon size={20} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Home</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Canali Pubblici</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {channels.length === 0 && open && (
              <p className="text-gray-500 text-xs p-2">
                No channels available. Create your first channel!
              </p>
            )}
            {channels.map((ch, index) => (
              <SidebarMenuItem key={ch.id}>
                <SidebarMenuButton asChild isActive={false}>
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleChannelSelect(ch)}
                  >
                    {open && (
                      <div
                        className="flex justify-between w-full items-center"
                        key={ch.id}
                      >
                        <div>
                          {index + 1}) {ch.name}
                        </div>
                        {isMyChannel(ch) && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChannel(ch);
                            }}
                            className="cursor-pointer hover:bg-red-200 p-2 rounded-full"
                          >
                            <TrashIcon className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                    )}
                    {!open && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>#{index + 1}</div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{ch.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};

export default ChatChannelList;
