import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMessage } from "@/lib/firebase/firestore/message.firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { SendIcon } from "lucide-react";
import React, { FormEvent, useContext, useState } from "react";

interface ChatMessageInputProps {
  placeholder?: string;
  channelId: string;
}

const ChatMessageInput = ({
  placeholder = "Scrivi un messaggio...",
  channelId,
}: ChatMessageInputProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;

  const [messageText, setMessageText] = useState("");
  const [disabled, setIsDisabled] = useState(false);

  const handleSendMessage = (messageText: string) => {
    if (!user?.uid || !messageText.trim() || !channelId) return;

    const msg = {
      message: messageText.trim(),
      userId: user.uid,
      channelId,
      displayName: user.displayName || "Utente",
      photoURL: user.photoURL || "",
    };

    setIsDisabled(true);
    addMessage(msg)
      .then(() => {
        console.log("Message sent");
        setIsDisabled(false);
        setMessageText("");
      })
      .catch((error) => {
        console.error("Error sending message", error);
        setIsDisabled(false);
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(messageText);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={placeholder}
            className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
          />
          <Button type="submit" disabled={disabled || !messageText.trim()}>
            <SendIcon size={24} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageInput;
