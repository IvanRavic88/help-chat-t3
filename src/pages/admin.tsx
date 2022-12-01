import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const AdminPage: NextPage = () => {
  const helpRequestQuery = trpc.helpRequest.getHelpRequest.useQuery();

  const handleHelpRequestClicked = () => {};

  return (
    <>
      <Head>
        <title>Admin Page</title>
        <meta name="description" content="chat app with t3 stack" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700">
          Admin Page
        </h1>
        <section className="flex">
          <div>
            {helpRequestQuery.data?.map((helpRequest) => (
              <button onClick={handleHelpRequestClicked} key={helpRequest.id}>
                {helpRequest.id}
              </button>
            ))}
          </div>
          {/* <div>
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
          </div> */}
        </section>
      </main>
    </>
  );
};
export default AdminPage;
