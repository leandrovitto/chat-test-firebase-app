import { useParams } from "react-router";
import ChatHeader from "./ChatHeader";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessageList from "./ChatMessageList";
import { useEffect, useState } from "react";
import {
  Channel,
  getChannelById,
} from "@/lib/firebase/firestore/channel.firestore";
import { Loader } from "../Loader";
import { FullMessageWrapped } from "../FullMessageWrapped";
import {
  getMessages,
  Message,
} from "@/lib/firebase/firestore/message.firestore";
import { firebase } from "@/lib/firebase/client";

const Chat = () => {
  const params = useParams<{ channelId: string }>();
  const channelId = params?.channelId;

  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessage, setLastMessage] =
    useState<firebase.firestore.Timestamp | null>(null);

  const fetchMoreMessages = async () => {
    if (!channelId || !lastMessage) return;

    getMessages(
      channelId,
      (newMessages) => {
        if (newMessages.length > 0) {
          setMessages((prev) => {
            const uniqueMessages = [
              ...newMessages
                .reverse()
                .filter(
                  (msg) => !prev.some((prevMsg) => prevMsg.id === msg.id)
                ),
              ...prev,
            ];
            return uniqueMessages;
          });
          setLastMessage(
            newMessages[0].timestamp as firebase.firestore.Timestamp
          );
        } else {
          setLastMessage(null);
        }
      },
      (error) => console.error(error),
      lastMessage
    );
  };

  useEffect(() => {
    if (!channelId) return;

    setChannel(null);
    setMessages([]);
    setLoading(true);

    getChannelById(channelId)
      .then((ch) => setChannel(ch))
      .catch((err) => {
        console.error(err);
        setChannel(null);
        setLoading(false);
      });

    getMessages(
      channelId,
      (initialMessages) => {
        setMessages(initialMessages.reverse());
        if (initialMessages.length > 0) {
          setLastMessage(
            initialMessages[0].timestamp as firebase.firestore.Timestamp
          );
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  }, [channelId]);

  if (loading) {
    return <Loader />;
  }

  if (!channel) {
    return (
      <FullMessageWrapped>
        <p>Channel not found.</p>
      </FullMessageWrapped>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader channel={channel} />
      <ChatMessageList
        messages={messages}
        fetchMoreMessages={fetchMoreMessages}
        last={!lastMessage}
      />
      <ChatMessageInput
        channelId={channel.id as string}
        placeholder={`Messaggio in #${channel.name}`}
        disabledComponent={loading}
      />
    </div>
  );
};

export default Chat;
