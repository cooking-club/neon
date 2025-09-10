import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { auth } from "~/server/auth";

export const postRouter = createTRPCRouter({
	create: publicProcedure
		.input(z.object({ text: z.string(), author: z.string(), timestamp: z.number() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					text: input.text,
					author: input.author,
					createdAt: new Date(input.timestamp),
				},
			});
		}),

	get: publicProcedure
	.query(async ({ ctx }) => {
		const posts = await ctx.db.post.findMany({
			orderBy: { createdAt: "desc" },
		});

		return posts;
	}),
});
