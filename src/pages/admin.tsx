import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const AdminPage: NextPage = () => {
  const helpRequestQuery = trpc.helpRequest.getHelpRequest.useQuery();

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
        {helpRequestQuery.data?.map((helpRequest) => (
          <div key={helpRequest.id}>{helpRequest.id}</div>
        ))}
      </main>
    </>
  );
};
export default AdminPage;
