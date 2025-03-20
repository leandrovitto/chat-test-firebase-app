import { Message } from "@/lib/firebase/firestore/message.firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { useContext, useEffect, useRef } from "react";
import { FullMessageWrapped } from "../FullMessageWrapped";
import ChatMessageItem from "./ChatMessageItem";

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList = ({ messages }: ChatMessageListProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Scorrimento automatico alla fine dei messaggi
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
    <div className="flex-grow overflow-y-auto p-4 space-y-3">
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
