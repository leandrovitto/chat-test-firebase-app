import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addMessage } from "@/lib/firebase/firestore/message.firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { SendIcon } from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatMessageInputProps {
  placeholder?: string;
  channelId: string;
  disabledComponent?: boolean;
}

const ChatMessageInput = ({
  placeholder = "Scrivi un messaggio...",
  channelId,
  disabledComponent,
}: ChatMessageInputProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;

  const [messageText, setMessageText] = useState("");
  const [disabled, setIsDisabled] = useState(disabledComponent);
  const inputRef = useRef<HTMLTextAreaElement>(null); // Ref for the input field

  const handleSendMessage = (messageText: string) => {
    if (!user?.uid || !channelId) return;

    //sanatize message
    const outputMessage = messageText.replace(/<[^>]*>?/gm, "");

    const msg = {
      message: outputMessage,
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
        inputRef.current?.focus(); // Set focus back to the input field
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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault(); // Prevent adding a new line
      handleSendMessage(messageText);
    }
  };

  useEffect(() => {
    setIsDisabled(disabledComponent);
  }, [disabledComponent]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t ">
      <div className="flex gap-2 items-center">
        <Textarea
          ref={inputRef} // Attach the ref to the input field
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown} // Attach the keydown handler
          placeholder={placeholder}
          className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled || !messageText.trim()}>
          <SendIcon size={24} />
        </Button>
      </div>

      <small>
        <span className="text-gray-500">Press ctrlKey + Enter to send</span>
      </small>
    </form>
  );
};

export default ChatMessageInput;
