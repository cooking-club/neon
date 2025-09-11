import * as Minio from "minio";

import { env } from "~/env";

const createMinioClient = () =>
	new Minio.Client({
		endPoint: env.MINIO_ENDPOINT,
		port: +env.MINIO_PORT,
		useSSL: false,
		accessKey: env.MINIO_ACCESS_KEY,
		secretKey: env.MINIO_SECRET_KEY,
	});

const globalForMinio = globalThis as unknown as {
	minio: ReturnType<typeof createMinioClient> | undefined;
};

export const files = globalForMinio.minio ?? createMinioClient();

if (env.NODE_ENV !== "production") globalForMinio.minio = files;
