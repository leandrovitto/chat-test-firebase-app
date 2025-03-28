import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Attached,
  deleteMessage,
  Message,
  updateMessage,
} from "@/lib/firebase/firestore/message.firestore";
import { Timestamp } from "firebase/firestore";
import {
  Download,
  Edit2,
  EllipsisVertical,
  Save,
  Trash2Icon,
  X,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import download from "@/lib/firebase/storage/download";

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
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message.id)
        .then(() => {
          toast("Message deleted successfully.");
        })
        .catch((error) => {
          toast.error("Error deleting message.");
          console.error("Error deleting message", error);
        });
    }
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

  const handleDownload = (m: Attached) => {
    download(m.child)
      .then((url) => {
        toast.message("Downloading...", {
          duration: 5000,
        });
        // add automatic download
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.download = m.url || "download";
        anchor.click();
        anchor.parentNode?.removeChild(anchor);
      })
      .catch((error) => {
        toast.error("Error during download: " + error.message, {
          duration: 5000,
        });
      });
  };

  return (
    <div
      className={`flex gap-4 px-2 py-1 rounded-lg min-w-xs max-w-md ${
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
        <div className="py-1">
          {message.attached && (
            <>
              <div
                className={`grid grid-cols-${
                  message.attached.length < 3 ? message.attached.length : 3
                } gap-2`}
              >
                {message.attached?.map((m, idx) => {
                  if (m.type == "image") {
                    return (
                      <div key={idx} className="relative">
                        <img
                          className="w-full h-full object-cover rounded-lg"
                          src={m.url}
                          width={"250"}
                        />
                        <Button
                          onClick={() => {
                            handleDownload(m);
                          }}
                          className="absolute bottom-2 right-2"
                        >
                          <Download className="size-5" />
                        </Button>
                      </div>
                    );
                  }
                })}
              </div>
            </>
          )}

          {isEditing ? (
            <div>
              <div className="flex items-center gap-2">
                <Textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
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
              <small>
                <span className="text-gray-500">
                  Press ctrlKey + Enter to send
                </span>
              </small>
            </div>
          ) : (
            <div className="whitespace-break-spaces text-sm">
              {message.message}
            </div>
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
