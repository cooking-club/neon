import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				text: z.string(),
				author: z.string(),
				timestamp: z.number(),
				attachments: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let attachments: string | null = null;

			if (input.attachments?.[0] !== undefined) {
				const bucket = "test"; // TODO: replace with actual author id
				const exists = await ctx.files.bucketExists(bucket);
				if (exists) {
					console.log(`Bucket ${bucket} exists.`);
				} else {
					await ctx.files.makeBucket(bucket);
					console.log(`Bucket ${bucket} created.`);
				}

				const fileURL = input.attachments[0];
				const fileRes = await fetch(fileURL);
				const buffer = Readable.fromWeb(fileRes.body as ReadableStream); // fix with ReadableStream

				const fileName = `${input.timestamp}-${path.basename(fileURL)}`;

				const objInfo = await ctx.files.putObject(bucket, fileName, buffer, 10);
				const url = await ctx.files.presignedGetObject(bucket, fileName);
				console.log("new object:", objInfo);
				attachments = url;
			}

			return ctx.db.post.create({
				data: {
					text: input.text,
					author: input.author,
					createdAt: new Date(input.timestamp),
					attachments,
				},
			});
		}),

	get: publicProcedure.query(async ({ ctx }) => {
		const posts = await ctx.db.post.findMany({
			orderBy: { createdAt: "desc" },
		});

		return posts;
	}),
});
