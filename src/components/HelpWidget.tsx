import { RtmChannel, RtmMessage } from "agora-rtm-sdk";
import React, { useRef, useState } from "react";
import { trpc } from "../utils/trpc";

type TMessage = {
  message: string;
  id: string;
  sender: string;
};

export const HelpWidget = () => {
  const [isChatPanelDisplayed, setIsChatPanelDisplayed] = useState(false);
  const [senderId, setSenderId] = useState("0");
  const [text, setText] = useState("");
  const channelRef = useRef<RtmChannel | null>(null);

  const [messages, setMessages] = useState<TMessage[]>([
    {
      message: "Hello, how can we help you today?",
      id: "vjkasf2r32",
      sender: "1",
    },
  ]);

  const createHelpRequestMutation =
    trpc.helpRequest.createHelpRequest.useMutation();

  const handlleOpenSupportWidget = async () => {
    setIsChatPanelDisplayed(true);
    const helpRequest = await createHelpRequestMutation.mutateAsync();

    const { default: AgoraRTM } = await import("agora-rtm-sdk");
    const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_ID!);
    await client.login({
      uid: `${Math.floor(Math.random() * 250)}`,
      token: undefined,
    });
    const channel = await client.createChannel(helpRequest.id);
    channelRef.current = channel;
    await channel.join();

    channel.on("channelMessage", (message: RtmMessage) => {
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

  return isChatPanelDisplayed ? (
    <div className="fixed bottom-10 right-10 flex h-96 w-72 flex-col justify-between bg-white p-6">
      <button
        className="absolute top-1 right-3 hover:text-red-500"
        onClick={() => setIsChatPanelDisplayed(false)}
      >
        X
      </button>
      <ul>
        {messages.map(({ message, id, sender }) => (
          <li
            key={id}
            className={`mb-2 rounded p-1 ${
              sender === senderId ? "bg-gray-50" : "bg-rose-50"
            }`}
          >
            {message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-rose-300 p-1 px-2 focus:outline-none"
          type="text"
        />
        <button className="ml-2 rounded-xl bg-rose-500 p-1 px-2 text-white hover:bg-rose-600">
          Send
        </button>
      </form>
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
