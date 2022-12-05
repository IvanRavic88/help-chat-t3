import type { HelpRequest } from "@prisma/client";
import type { RtmChannel } from "agora-rtm-sdk";
import React, { useRef, useState } from "react";
import { useRTM } from "../hooks/useRTM";
import { trpc } from "../utils/trpc";
import { ChatPanel } from "./ChatPanel";

export type TMessage = {
  message: string;
  id: string;
  sender: string;
};

export const HelpWidget = () => {
  const { messages, connectTo, sendMessage } = useRTM([
    { message: "How can I help you?", id: "123124312r", sender: "0" },
  ]);
  const [isChatPanelDisplayed, setIsChatPanelDisplayed] = useState(false);
  const [text, setText] = useState("");
  const channelRef = useRef<RtmChannel | null>(null);
  const helpRequestRef = useRef<HelpRequest | null>(null);

  const createHelpRequestMutation =
    trpc.helpRequest.createHelpRequest.useMutation();

  const deleteHelpRequestMutation =
    trpc.helpRequest.deleteHelpRequest.useMutation();

  const handlleOpenSupportWidget = async () => {
    setIsChatPanelDisplayed(true);
    const helpRequest = await createHelpRequestMutation.mutateAsync();
    helpRequestRef.current = helpRequest;
    connectTo(helpRequest.id);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(text);
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
