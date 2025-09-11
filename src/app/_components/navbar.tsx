import {
	HomeIcon,
	NewspaperIcon,
	RssIcon,
	SearchIcon,
	UserIcon,
} from "lucide-react";
import type { ReactElement } from "react";
import Link from "next/link";

const navItems = [
	{ label: "Search", icon: <SearchIcon />, link: "#" },
	{ label: "Feed", icon: <NewspaperIcon />, link: "/" },
	{ label: "Home", icon: <HomeIcon />, link: "/home" },
	{ label: "Follows", icon: <RssIcon />, link: "#" },
	{ label: "Profile", icon: <UserIcon />, link: "#" },
];

export function NavBar() {
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
