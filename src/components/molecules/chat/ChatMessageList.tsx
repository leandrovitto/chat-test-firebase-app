import { Message } from "@/lib/firebase/firestore/message.firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { FullMessageWrapped } from "../FullMessageWrapped";
import ChatMessageItem from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: Message[];
  fetchMoreMessages: () => Promise<void>;
  last: boolean;
}

const ChatMessageList = ({
  messages,
  fetchMoreMessages,
  last,
}: ChatMessageListProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the scroll container
  const [isFetching, setIsFetching] = useState(false);

  /*   const handleScroll = async () => {
    console.log("scrolling");
    if (!containerRef.current || isFetching) return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      await handleLoadingMore();
    }
  };

  // Attach the scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isFetching, fetchMoreMessages]); */

  const handleLoadingMore = async () => {
    setIsFetching(true);
    await fetchMoreMessages();
    setIsFetching(false);
  };

  // Scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <FullMessageWrapped>
        <div className="text-center text-xs text-gray-500">
          No messages yet. Start the conversation! 😊
        </div>
      </FullMessageWrapped>
    );
  }

  const isCurrentUser = (message: Message) => {
    return message.userId === user?.uid;
  };

  return (
    <div ref={containerRef} className="flex-grow overflow-y-auto p-4 space-y-3">
      {!isFetching && !last && (
        <div
          onClick={handleLoadingMore}
          className="text-center text-xs text-gray-500 cursor-pointer"
        >
          Load more messages...
        </div>
      )}
      {isFetching && (
        <div className="text-center text-xs text-gray-500">Loading more...</div>
      )}
      {messages.map((message) => (
        <div
          className={`flex ${
            isCurrentUser(message) ? "justify-end" : "justify-start"
          }`}
          key={message.id || `${message.userId}-${message.message}`}
        >
          <ChatMessageItem
            message={message}
            myMessage={isCurrentUser(message)}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
