import { Button } from "~/components/ui/button";

export function Header() {
	const filters = ["All", "Clubs", "Users", "News", "Follows"];

	return (
		<div className="sticky top-0 z-10 border-b bg-background pb-2">
			<div className="mb-2 flex justify-center">
				<h1 className="font-black text-4xl">neon</h1>
			</div>
			<NavMenu chips={filters} />
		</div>
	);
}

function NavMenu({ chips }: { chips: string[] }) {
	return (
		<div className="overflow-hidden">
			<div className="flex items-center gap-3 overflow-x-scroll px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{chips.map((item, idx) => (
					<NavChip label={item} key={idx} />
				))}
			</div>
		</div>
	);
}

function NavChip({ label }: { label: string }) {
	return (
		<Button size="sm" variant="secondary">
			{label}
		</Button>
	);
}
