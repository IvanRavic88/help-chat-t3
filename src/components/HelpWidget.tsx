import type { HelpRequest } from "@prisma/client";
import type { RtmChannel, RtmMessage } from "agora-rtm-sdk";
import React, { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import { ChatPanel } from "./ChatPanel";

export type TMessage = {
  message: string;
  id: string;
  sender: string;
};

export const HelpWidget = () => {
  const [isChatPanelDisplayed, setIsChatPanelDisplayed] = useState(false);
  const [senderId, setSenderId] = useState("0");
  const [text, setText] = useState("");
  const channelRef = useRef<RtmChannel | null>(null);
  const helpRequestRef = useRef<HelpRequest | null>(null);
  const [messages, setMessages] = useState<TMessage[]>([
    {
      message: "Hello, how can we help you today?",
      id: "vjkasf2r32",
      sender: "1",
    },
  ]);

  const createHelpRequestMutation =
    trpc.helpRequest.createHelpRequest.useMutation();

  const deleteHelpRequestMutation =
    trpc.helpRequest.deleteHelpRequest.useMutation();

  const handlleOpenSupportWidget = async () => {
    setIsChatPanelDisplayed(true);
    const helpRequest = await createHelpRequestMutation.mutateAsync();

    const { default: AgoraRTM } = await import("agora-rtm-sdk");
    const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_ID!);
    await client.login({
      uid: `${Math.floor(Math.random() * 250)}`,
      token: undefined,
    });
    helpRequestRef.current = helpRequest;
    const channel = await client.createChannel(helpRequest.id);
    channelRef.current = channel;
    await channel.join();

    channel.on("ChannelMessage", (message: RtmMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: message.text ?? "", id: Math.random() + "", sender: "1" },
      ]);
    });
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const channel = channelRef.current;
    channel?.sendMessage({ text });
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: text, id: Math.random() + "", sender: senderId },
    ]);
    setText("");
  };

  const handleCloseWidget = async () => {
    setIsChatPanelDisplayed(false);
    channelRef.current?.leave();
    channelRef.current = null;
    if (!helpRequestRef.current) return;
    await deleteHelpRequestMutation.mutateAsync({
      id: helpRequestRef.current.id,
    });
    helpRequestRef.current = null;
  };

  return isChatPanelDisplayed ? (
    <div className="fixed bottom-10 right-10 flex h-96 w-72 flex-col justify-between bg-white p-6">
      <ChatPanel
        text={text}
        setText={setText}
        messages={messages}
        onClose={handleCloseWidget}
        handleSendMessage={handleSendMessage}
      />
    </div>
  ) : (
    <button
      onClick={handlleOpenSupportWidget}
      className="fixed bottom-10 right-10 cursor-pointer rounded-xl bg-emerald-500 p-2 px-3 text-white hover:bg-emerald-600"
    >
      Speek to our Support Team
    </button>
  );
};
