import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { NavBar } from "~/app/_components/navbar";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { env } from "~/env";
import { ErudaContainer } from "~/components/eruda";

export const metadata: Metadata = {
	title: "Neon v0.1",
	description: "The super portal to everything you need",
	icons: [
		{ rel: "icon", url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
		{
			rel: "icon",
			url: "/icon-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			rel: "icon",
			url: "/icon-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
		{
			rel: "apple-touch-icon",
			url: "/apple-touch-icon.png",
			sizes: "180x180",
			type: "image/png",
		},
	],
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
	],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="bg-background text-foreground">
						<TRPCReactProvider>
							<NextIntlClientProvider>
								{children}
								{env.NODE_ENV === "development" && <ErudaContainer />}
								<NavBar />
							</NextIntlClientProvider>
						</TRPCReactProvider>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
