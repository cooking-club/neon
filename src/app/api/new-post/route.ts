import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { headers } from 'next/headers'

interface PostData {
  text: string;
  author: string;
  timestamp: number;
}

export async function POST(req: Request) {
  // Create context and caller
  const ctx = await createTRPCContext({ headers: await headers() });
  const caller = createCaller(ctx);
  try {
    const data: PostData = await req.json()
    const post = await caller.post.create({ text: data.text, timestamp: data.timestamp, author: data.author });
    return Response.json(post);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      // An error from tRPC occurred
      const httpCode = getHTTPStatusCodeFromError(cause);
      return new Response(JSON.stringify(cause), {
        status: httpCode
      });
    }
    // Another error occurred
    console.error(cause);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500
    });
  }
};