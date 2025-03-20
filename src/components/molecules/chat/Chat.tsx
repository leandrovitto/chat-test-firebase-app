import { useParams } from "react-router";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";

const Chat = () => {
  const params = useParams<{ channelId: string }>();

  if (!params?.channelId) {
    return <div>Select a channel</div>;
  }

  return (
    <div>
      <ChatHeader />
      <ChatMessageList />
      <ChatMessageInput />
    </div>
  );
};

export default Chat;
