import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
type Props = {};

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Canali Pubblici",
      url: "#",
      items: [
        {
          title: "Channnel #1",
          url: "#",
        },
        {
          title: "Channnel #2",
          url: "#",
        },
      ],
    },
  ],
};

const ChatChannelList = (_props: Props) => {
  const { open } = useSidebar();
  return (
    <div>
      {data.navMain.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={false}>
                    <div key={index}>
                      {open && <a href={item.url}>{item.title}</a>}
                      {!open && <span>#{index + 1}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  );
};

export default ChatChannelList;
