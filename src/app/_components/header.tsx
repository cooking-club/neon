import { Button } from "~/components/ui/button";

export function Header() {
	const filters = ["All", "Clubs", "Users", "News", "Follows"];

	return (
		<div className="sticky border-b pb-2 top-0 bg-background z-10">
			<div className="flex justify-center mb-2">
				<h1 className="text-4xl font-black">neon</h1>
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
