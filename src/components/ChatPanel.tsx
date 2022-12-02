import type { TMessage } from "./HelpWidget";

export const ChatPanel = ({
  handleSendMessage,
  onClose,
  text,
  setText,
  messages,
}: {
  onClose?: () => void;
  handleSendMessage: any;
  messages: TMessage[];
  text: string;
  setText: (newText: string) => void;
}) => {
  return (
    <>
      {onClose && (
        <button
          className="absolute top-1 right-3 hover:text-red-500"
          onClick={onClose}
        >
          X
        </button>
      )}
      <div className="fixed bottom-10 right-10 flex h-96 w-72 flex-col justify-between bg-white p-6">
        {" "}
        <ul className="h-[300] overflow-auto">
          {messages.map(({ message, id, sender }) => (
            <li
              key={id}
              className={`mb-2 rounded p-1 ${
                sender === "1" ? "bg-gray-50" : "bg-rose-50"
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
    </>
  );
};
