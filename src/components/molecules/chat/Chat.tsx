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

const Chat = () => {
  const params = useParams<{ channelId: string }>();
  const channelId = params?.channelId;

  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);

  if (!channelId) {
    return <div>Select a channel</div>;
  }

  useEffect(() => {
    // Load the channel data
    if (!channelId) return;

    setLoading(true);
    // Fetch channel details
    getChannelById(channelId)
      .then((ch) => {
        setChannel(ch);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setChannel(null);
        setLoading(false);
      });
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
    <div>
      <ChatHeader />
      <ChatMessageList />
      <ChatMessageInput
        channelId={channel.id as string}
        placeholder={`Messaggio in #${channel.name}`}
      />
    </div>
  );
};

export default Chat;
