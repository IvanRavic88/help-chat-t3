import { useState } from "react";
import { trpc } from "../utils/trpc";

type TMessage = {
  message: string;
  id: string;
  sender: string;
};

export const HelpWidget = () => {
  const [isChatPanelDisplayed, setIsChatPanelDisplayed] = useState(false);
  const [senderId, setSenderId] = useState("0");

  const [messages, setMessage] = useState<TMessage[]>([
    { message: "Hello, how can we help you today?", id: "2", sender: "0" },
    { message: "I need help fixing my computer", id: "1", sender: "1" },
  ]);

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

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
      <form className="flex">
        <input
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
      onClick={() => setIsChatPanelDisplayed(true)}
      className="fixed bottom-10 right-10 cursor-pointer rounded-xl bg-emerald-500 p-2 px-3 text-white hover:bg-emerald-600"
    >
      Speek to our Support Team
    </button>
  );
};
