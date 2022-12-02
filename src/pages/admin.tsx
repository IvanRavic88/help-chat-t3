import type { HelpRequest } from "@prisma/client";
import type { RtmChannel, RtmMessage } from "agora-rtm-sdk";
import type { NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import type { TMessage } from "../components/HelpWidget";
import { ChatPanel } from "../components/ChatPanel";

const AdminPage: NextPage = () => {
  // const [senderId, setSenderId] = useState("1");
  const helpRequestQuery = trpc.helpRequest.getHelpRequest.useQuery();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const channelRef = useRef<RtmChannel | null>(null);
  const [text, setText] = useState("");

  const handleHelpRequestClicked = async (helpRequest: HelpRequest) => {
    setMessages([]);
    if (channelRef.current) {
      channelRef.current.leave();
      channelRef.current = null;
    }
    const { default: AgoraRTM } = await import("agora-rtm-sdk");
    const client = AgoraRTM.createInstance(process.env.NEXT_PUBLIC_AGORA_ID!);
    await client.login({
      uid: `${Math.floor(Math.random() * 250)}`,
      token: undefined,
    });
    const channel = client.createChannel(helpRequest.id);
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
      { message: text, id: Math.random() + "", sender: "0" },
    ]);
    setText("");
  };

  return (
    <>
      <Head>
        <title>Admin Page</title>
        <meta name="description" content="chat app with t3 stack" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col">
        <h1 className=" mb-2 text-3xl font-extrabold leading-normal text-gray-700">
          Admin Page
        </h1>
        <section className="flex gap-4">
          <div className="rounded bg-white p-4">
            <h2 className="mb-2 text-xl">Help Request Ids:</h2>
            <div className="flex flex-col gap-2">
              {helpRequestQuery.data?.map((helpRequest) => (
                <button
                  className="hover:text-orange-500"
                  onClick={() => handleHelpRequestClicked(helpRequest)}
                  key={helpRequest.id}
                >
                  {helpRequest.id}
                </button>
              ))}
            </div>
          </div>
          <ChatPanel
            text={text}
            setText={setText}
            messages={messages}
            handleSendMessage={handleSendMessage}
          />
        </section>
      </main>
    </>
  );
};
export default AdminPage;
