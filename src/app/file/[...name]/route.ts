import type { NextRequest } from "next/server";
import { env } from "~/env";

export async function GET(
	_req: NextRequest,
	ctx: RouteContext<"/file/[...name]">,
) {
	const { name } = await ctx.params;

	const externalUrl = `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${name.join("/")}`;
	const remoteFile = await fetch(externalUrl);

	if (!remoteFile.ok) {
		return new Response(null, {
			status: 404,
		});
	}

	const contentLength = remoteFile.headers.get("content-length");

	return new Response(remoteFile.body, {
		headers: {
			"Content-Type":
				remoteFile.headers.get("content-type") || "application/octet-stream",
			"Cache-Control": "public, max-age=31536000, immutable",
			...(contentLength ? { "Content-Length": contentLength } : {}),
		},
	});
}
