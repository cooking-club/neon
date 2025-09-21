import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

const COOKIE_NAME = "NEXT_LOCALE";

type Locale = "en" | "ru";
const defaultLocale: Locale = "en";
const availableLocales = ["en", "ru"] as const;

export async function getUserLocale(): Promise<Locale> {
	let locale = (await cookies()).get(COOKIE_NAME)?.value;

	if (locale === undefined) {
		const acceptLanguages = new Negotiator({
			headers: {
				"accept-language":
					(await headers()).get("accept-language") ?? undefined,
			},
		}).languages();
		locale = match(acceptLanguages, availableLocales, defaultLocale);
	}

	return locale as Locale;
}

export async function setUserLocale(locale: Locale) {
	(await cookies()).set(COOKIE_NAME, locale);
}

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	return {
		locale,
		messages: (await import(`./${locale}.json`)).default,
	};
});
