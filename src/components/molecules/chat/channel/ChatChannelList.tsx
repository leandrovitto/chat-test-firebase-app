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
  getChannels,
} from "@/lib/firebase/firestore/channel.firestore";
import { Tooltip } from "@radix-ui/react-tooltip";
import { HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
type Props = {};

const ChatChannelList = (_props: Props) => {
  const navigate = useNavigate(); // Initialize router
  const { open } = useSidebar();
  // const { user } = useContext(AuthContext) as AuthContextType;

  const [loading, setLoading] = useState(false);
  const [loadingDelete, _setLoadingDelete] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
    navigate(`/chat/${channel.id}`); // Navigate to the channel-specific route
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
          Caricamento canali in corso...
        </p>
      </div>
    );
  }

  if (loadingDelete) {
    return (
      <div className="flex-grow overflow-y-auto">
        <p className="text-gray-500 text-center p-4">
          Eliminazione in corso...
        </p>
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
            {channels.map((ch, index) => (
              <SidebarMenuItem key={ch.id}>
                <SidebarMenuButton asChild isActive={false}>
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleChannelSelect(ch)}
                  >
                    {open && (
                      <div className="flex justify-between w-full" key={ch.id}>
                        <div>
                          {index + 1}) {ch.name}
                        </div>
                        <div>*</div>
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
