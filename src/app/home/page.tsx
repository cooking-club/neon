import { Calendar } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ReactElement } from "react";
import { Skeleton } from "~/components/ui/skeleton";

type ServiceItem = {
	label: string;
	description: string;
	icon: ReactElement;
	path: string;
};

export default async function Home() {
	const t = await getTranslations("Home");

	const services: ServiceItem[] = [
		{
			label: t("schedule.label"),
			description: "",
			icon: <Calendar />,
			path: "/schedule",
		},
	];

	return (
		<div className="pb-7">
			<div className="border-b px-5 py-5">
				<h2 className="font-bold text-2xl">{t("title")}</h2>
			</div>
			<div className="px-3 py-5">
				{services.map((item, idx) => (
					<ServiceCard {...item} key={idx} />
				))}
			</div>
		</div>
	);
}

interface ServiceCardProps {
	label: string;
	path: string;
	icon: ReactElement;
}

function ServiceCard({ label, path, icon }: ServiceCardProps) {
	return (
		<Link href={path}>
			<div className="w-full rounded-md border-2 pb-1">
				<div className="space-y-3 px-3 py-3">
					{Array.from({ length: 4 }).map((_, idx) => (
						<div className="flex gap-2" key={idx}>
							<Skeleton className="size-10 rounded-full" />
							<Skeleton className="h-10 grow rounded-full" />
						</div>
					))}
				</div>
				<div className="flex items-center gap-2 border-t px-3 py-1">
					<span>{icon}</span>
					<span className="font-bold text-xl">{label}</span>
				</div>
			</div>
		</Link>
	);
}
