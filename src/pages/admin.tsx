import type { HelpRequest } from "@prisma/client";

import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";

import { ChatPanel } from "../components/ChatPanel";
import { useRTM } from "../hooks/useRTM";

const AdminPage: NextPage = () => {
  const { messages, clearMessages, connectTo, sendMessage } = useRTM([]);
  const [text, setText] = useState("");

  const helpRequestQuery = trpc.helpRequest.getHelpRequest.useQuery();

  const handleHelpRequestClicked = async (helpRequest: HelpRequest) => {
    clearMessages();
    connectTo(helpRequest.id);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(text);
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
