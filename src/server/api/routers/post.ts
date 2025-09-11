import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import { z } from "zod";
import { env } from "~/env";

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
				const fileURL = input.attachments[0];
				const fileRes = await fetch(fileURL);
				const buffer = Readable.fromWeb(fileRes.body as ReadableStream); // fix with ReadableStream

				const fileName = `${input.author.replace(" ", "-")}/${input.timestamp}-${path.basename(fileURL)}`; // todo: replace author with id

				await ctx.files.putObject(env.MINIO_PUBLIC_BUCKET, fileName, buffer); // todo: add meta data
				attachments = `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${env.MINIO_PUBLIC_BUCKET}/${fileName}`; // todo: remake this part without relaying on host/port thing
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
