/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import createNextIntlPlugin from "next-intl/plugin";
import withSerwistInit from "@serwist/next";

/** @type {import("next").NextConfig} */
const config = {};

const withNextIntl = createNextIntlPlugin();

const withSerwist = withSerwistInit({
	swSrc: "src/app/sw.ts",
	swDest: "public/sw.js",
	cacheOnNavigation: true,
	additionalPrecacheEntries: [
		{
			url: "/",
			revision: "v1",
		},
		{
			url: "/schedule",
			revision: "v1",
		},
		{
			url: "/home",
			revision: "v1",
		},
	],
});

export default withSerwist(withNextIntl(config));
