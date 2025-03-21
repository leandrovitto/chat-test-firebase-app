import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addMessage,
  Message,
} from "@/lib/firebase/firestore/message.firestore";
import upload from "@/lib/firebase/storage/upload";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import clsx from "clsx";
import { Image, SendIcon, Smile } from "lucide-react";
import {
  DragEvent,
  FormEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";

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

  const LIMIT_FILES = 3;
  const [messageText, setMessageText] = useState("");
  const [disabled, setIsDisabled] = useState(disabledComponent);
  const [isDragging, setIsDragging] = useState(false); // State to track drag status
  const [uploadedImages, setUploadedImages] = useState<File[]>([]); // Store uploaded images
  const [uploadProgress, setUploadProgress] = useState<number[]>([]); // Track upload progress for each image
  const [openEmoji, setOpenEmoji] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null); // Ref for the input field

  const formIsValid = messageText.trim() || uploadedImages.length > 0;
  const isDisabled = disabled || !formIsValid;

  const handleSendMessage = async (messageText: string) => {
    if (!user?.uid || !channelId) return;
    setIsDisabled(true);

    // Sanitize message
    const outputMessage = messageText.replace(/<[^>]*>?/gm, "");

    const msg: Message = {
      message: outputMessage,
      userId: user.uid,
      channelId,
      displayName: user.displayName || "Utente",
      photoURL: user.photoURL || "",
      attached: [],
    };

    if (uploadedImages.length > 0) {
      const progressArray = new Array(uploadedImages.length).fill(0); // Initialize progress array
      setUploadProgress(progressArray);

      // Upload images
      await Promise.all(
        uploadedImages.map((image, index) =>
          upload(image, channelId, user.uid, (progress) => {
            // Update progress for the specific image
            setUploadProgress((prev) => {
              const updatedProgress = [...prev];
              updatedProgress[index] = progress;
              return updatedProgress;
            });
          })
            .then(({ url, child }) => {
              if (url) {
                console.log("Image uploaded", url);
                msg.attached = msg.attached || [];
                msg.attached.push({
                  type: "image",
                  url: url as string,
                  child: child,
                });
              }
            })
            .catch((error) => {
              console.error("Error uploading image", error);
              toast.error("Error during image upload: " + error.message, {
                duration: 5000,
              });
            })
        )
      );
    }

    addMessage(msg)
      .then(() => {
        console.log("Message sent");
        setIsDisabled(false);
        setMessageText("");
        inputRef.current?.focus(); // Set focus back to the input field
        setUploadedImages([]); // Clear uploaded images
        setUploadProgress([]); // Clear progress
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

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("Files", files);
    addImages(files);

    // Reset the file input value to allow re-selecting the same file
    e.target.value = "";
  };

  const handleEmoji = (e: { emoji: string }) => {
    setMessageText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  const handleDragOver = (
    e: DragEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true); // Set dragging state to true
  };

  const handleDragLeave = (
    e: DragEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Reset dragging state
  };

  const handleDrop = (e: DragEvent<HTMLDivElement | HTMLTextAreaElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Reset dragging state
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const addImages = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const newImages = [...uploadedImages, ...imageFiles].slice(0, LIMIT_FILES); // Limit to 3 images
    setUploadedImages(newImages);
    setUploadProgress(new Array(newImages.length).fill(0)); // Reset progress for new images
  };

  const handleDeleteAttached = (idx: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== idx);
    setUploadedImages(updatedImages);

    const updatedProgress = uploadProgress.filter((_, i) => i !== idx);
    setUploadProgress(updatedProgress);
  };

  useEffect(() => {
    setIsDisabled(disabledComponent);
  }, [disabledComponent]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex flex-col gap-2">
        {/* Image Previews */}
        <div className="flex gap-2 items-center">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative w-16 h-16">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Delete Icon */}
              {uploadProgress[index] == 0 && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteAttached(index);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
              )}
              {/* Upload Progress */}
              {uploadProgress[index] > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center rounded-b-lg">
                  {Math.round(uploadProgress[index])}%
                </div>
              )}
            </div>
          ))}
          {uploadedImages.length >= LIMIT_FILES && (
            <div>
              <span className="text-sm text-red-500 ">
                Max {LIMIT_FILES} images
              </span>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={clsx("w-full", {
            "bg-white": !isDragging,
            "bg-gray-50 border-dashed border-2 p-4 rounded-xl": isDragging, // Change background color on drag
          })}
        >
          <div className="flex gap-4 items-center">
            <div>
              <Label htmlFor="file" className="cursor-pointer">
                <Image size={24} />
              </Label>
              <Input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={handleImg}
                multiple
                accept="image/*"
                disabled={disabled}
              />
            </div>
            <div className="emoji cursor-pointer">
              <Smile onClick={() => setOpenEmoji((prev) => !prev)} size={24} />
              <div className="picker">
                <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
              </div>
            </div>
            <Textarea
              ref={inputRef} // Attach the ref to the input field
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown} // Attach the keydown handler
              placeholder={placeholder}
              className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            />
            <Button type="submit" disabled={isDisabled}>
              <SendIcon size={24} />
            </Button>
          </div>
        </div>
      </div>

      <small>
        <span className="text-gray-500">
          Press ctrlKey + Enter to send | Max 3 Files / Limit size 1Mb{" "}
        </span>
      </small>
    </form>
  );
};

export default ChatMessageInput;
