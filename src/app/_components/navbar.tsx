import {
	HomeIcon,
	NewspaperIcon,
	RssIcon,
	SearchIcon,
	UserIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactElement } from "react";

export function NavBar() {
	const t = useTranslations("Navbar");

	const navItems = [
		{ label: t("labels.search"), icon: <SearchIcon />, link: "#" },
		{ label: t("labels.feed"), icon: <NewspaperIcon />, link: "/" },
		{ label: t("labels.home"), icon: <HomeIcon />, link: "/home" },
		{ label: t("labels.follows"), icon: <RssIcon />, link: "#" },
		{ label: t("labels.profile"), icon: <UserIcon />, link: "#" },
	];

	return (
		<div className="fixed bottom-0 flex w-screen items-center justify-around border-t bg-background py-2">
			{navItems.map((item, idx) => (
				<NavItem {...item} key={idx} />
			))}
		</div>
	);
}

interface NavItemProps {
	label: string;
	icon: ReactElement;
	link: string;
}

export function NavItem({ label, icon, link }: NavItemProps) {
	return (
		<Link
			href={link}
			className="flex flex-col items-center gap-1 text-muted-foreground leading-none hover:text-primary"
		>
			{icon}
			{label}
		</Link>
	);
}
