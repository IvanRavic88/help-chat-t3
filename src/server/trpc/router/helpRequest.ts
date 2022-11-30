import { router, publicProcedure } from "../trpc";

export const helpRequestRouter = router({
  createHelpRequest: publicProcedure.mutation(async ({ ctx }) => {
    const helpRequest = await ctx.prisma.helpRequest.create({ data: {} });

    return helpRequest;
  }),
  getHelpRequest: publicProcedure.query(async ({ ctx }) => {
    const helpRequests = await ctx.prisma.helpRequest.findMany();
    return helpRequests;
  }),
});
