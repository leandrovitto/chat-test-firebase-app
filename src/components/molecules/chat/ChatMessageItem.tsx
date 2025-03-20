import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteMessage,
  Message,
  updateMessage,
} from "@/lib/firebase/firestore/message.firestore";
import { Timestamp } from "firebase/firestore";
import { Edit2, EllipsisVertical, Save, Trash2Icon, X } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

const ChatMessageItem = ({
  message,
  myMessage = false,
}: {
  message: Message;
  variant?: boolean;
  myMessage?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);

  const handleDeleteMessage = () => {
    if (!message.id) return;
    deleteMessage(message.id)
      .then(() => {
        toast("Message deleted successfully.");
      })
      .catch((error) => {
        toast.error("Error deleting message.");
        console.error("Error deleting message", error);
      });
  };

  const handleEditMessage = () => {
    setIsEditing(true);
  };

  const handleSaveMessage = () => {
    if (!message.id) return;
    updateMessage(message.id, { message: editedMessage })
      .then(() => {
        toast("Message updated successfully.");
        setIsEditing(false);
      })
      .catch((error) => {
        toast.error("Error updating message.");
        console.error("Error updating message", error);
      });
  };

  const handleCancelEdit = () => {
    setEditedMessage(message.message); // Reset to original message
    setIsEditing(false);
  };

  return (
    <div
      className={`flex gap-4 px-2 py-1 rounded-lg min-w-xs ${
        !myMessage ? "bg-gray-100 " : "bg-gray-200"
      }`}
      key={message.id || `${message.userId}-${message.message}`}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between gap-1 border-b border-gray-300 pb-1">
          <div className="flex items-center gap-2">
            <img
              src={
                message?.photoURL ||
                "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              }
              className="size-6 rounded-full"
            />
            <div className="text-xs text-gray-500 truncate">
              {typeof message.displayName === "string" && message.displayName
                ? message.displayName.substring(0, 10)
                : "Unknown"}
              {message.displayName && message.displayName.length > 10
                ? "..."
                : ""}
            </div>
          </div>
          <div>
            {myMessage && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {!isEditing && (
                    <>
                      <DropdownMenuItem onClick={handleEditMessage}>
                        <div className="flex items-center gap-2">
                          <Edit2 size={16} /> Edit
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeleteMessage}>
                        <div className="flex items-center gap-2">
                          <Trash2Icon size={16} /> Delete
                        </div>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className="text-sm py-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveMessage();
                  }
                }}
                className="border border-gray-300 rounded px-2 py-1 w-full"
              />
              <button
                onClick={handleSaveMessage}
                className="text-blue-500 hover:underline"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:underline"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            message.message
          )}
        </div>
        <div className="text-xs text-gray-500 text-right">
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

export default ChatMessageItem;
