import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";

const Chat = () => {
  return (
    <div>
      <ChatHeader />
      <ChatMessageList />
      <ChatMessageInput />
    </div>
  );
};

export default Chat;
