import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const reactionRouter = createTRPCRouter({
	new: publicProcedure
		.input(
			z.object({
				postId: z.number(),
				kind: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.reaction.create({
				data: {
					count: 1,
					kind: input.kind,
					postId: input.postId,
				},
			});
		}),
	add: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.reaction.update({
				data: {
					count: { increment: 1 },
				},
				where: {
					id: input.id,
				},
			});
		}),
	remove: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.reaction.update({
				data: {
					count: { decrement: 1 },
				},
				where: {
					id: input.id,
				},
			});
		}),
});
