import { Message } from "@/lib/firebase/firestore/message.firestore";
import { useContext, useEffect, useRef } from "react";
import { FullMessageWrapped } from "../FullMessageWrapped";
import { Timestamp } from "firebase/firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import moment from "moment";

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
          <MessageItem message={message} variant={isCurrentUser(message)} />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const MessageItem = ({
  message,
  variant = false,
}: {
  message: Message;
  variant?: boolean;
}) => {
  return (
    <div
      className={`flex gap-4 px-2 py-1 rounded-lg min-w-xs ${
        !variant ? "bg-gray-100 " : "bg-gray-200"
      }`}
      key={message.id || `${message.userId}-${message.message}`}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1 border-b border-gray-300 pb-1">
          <img
            src={
              message?.photoURL ||
              "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            }
            className="size-6 rounded-full"
          />
          <div className="text-xs text-gray-500">{message.displayName}</div>
        </div>
        <div className="text-sm">{message.message}</div>
        <div className="text-xs text-gray-500 text-right mt-0.5">
          {message.timestamp instanceof Timestamp ? (
            <span>{moment(message.timestamp.toDate()).fromNow()}</span>
          ) : (
            <span>-</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageList;
