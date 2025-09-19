"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SmilePlus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

dayjs.extend(relativeTime);

interface PostProps {
	text: string;
	author: string;
	createdAt: Date;
	attachments: string | null; // todo: add media types
}

type ReactionInfoType = {
	icon: string;
	alt: string;
};

const defaultReactions: ReactionInfoType[] = [
	{ icon: "/grinning.png", alt: "Grinning emoji" },
	{ icon: "/fire.png", alt: "Fire emoji" },
	{ icon: "/heart.png", alt: "Heart emoji" },
	{
		icon: "/smiling_with_tear.png",
		alt: "Smilling face with tears emoji",
	},
	{ icon: "/peach.png", alt: "Peach emoji" },
	{ icon: "/eggplant.png", alt: "Eggplant emoji" },
];

type ReactionItemType = {
	id: number;
	count: number;
	active: boolean;
};

export function Post({ text, author, createdAt, attachments }: PostProps) {
	const [imgOpen, setImgOpen] = useState(false);
	const [reactions, setReactions] = useState<ReactionItemType[]>([]);

	const available = useMemo(
		() =>
			defaultReactions
				.map((_, idx) => idx)
				.filter((id) => !reactions.some((v) => v.id === id)),
		[reactions],
	);

	const addReaction = (id: number) =>
		setReactions((r) => [...r, { id: id, count: 1, active: true }]);

	const updReaction = (id: number) => {
		setReactions((r) =>
			r.map((item) =>
				item.id === id
					? {
							id: item.id,
							count: item.count + (item.active ? -1 : 1),
							active: !item.active,
						}
					: item,
			),
		);
	};

	return (
		<div className="mx-3 mt-3 rounded-xl border px-3 py-3">
			<div className="flex gap-2">
				<Avatar className="size-12">
					{/* <AvatarImage src={author.avatarURL} /> */}
					<AvatarFallback>
						{author
							.split(" ")
							.map((item) => item.slice(0, 1))
							.join("")}
					</AvatarFallback>
				</Avatar>
				<div className="">
					<h3 className="font-semibold text-xl tracking-tight">{author}</h3>
					<p className="text-muted-foreground text-sm">
						{dayjs().to(createdAt)}
					</p>
				</div>
			</div>
			<p className="my-2 line-clamp-3">{text}</p>
			{attachments ? (
				<>
					<div
						className="aspect-square rounded bg-center bg-cover"
						style={{ backgroundImage: `url(${attachments})` }}
						onClick={() => setImgOpen(true)}
						onKeyDown={() => setImgOpen(true)}
					/>
					{imgOpen && (
						<div
							className="fixed top-0 left-0 z-10 grid h-screen w-screen items-center bg-background-overlay"
							onClick={() => setImgOpen(false)}
							onKeyDown={() => setImgOpen(false)}
						>
							<img className="" src={attachments} alt="" />
						</div>
					)}
				</>
			) : null}
			<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-2 overflow-y-hidden">
				{reactions.map((item, idx) => (
					<Reaction
						{...item}
						key={item.id}
						incCount={() => updReaction(item.id)}
					/>
				))}
				{reactions.length !== defaultReactions.length && (
					<AddReactionButton addReaction={addReaction} available={available} />
				)}
			</div>
		</div>
	);
}

interface ReactionProps {
	active: boolean;
	count: number;
	id: number;
	incCount(): void;
}

function Reaction({ active, count, incCount, id }: ReactionProps) {
	console.log("active", active, id);
	return (
		<button
			type="button"
			className={cn(
				"flex items-center gap-2 rounded-full border bg-background px-4 py-2 leading-none",
				active && "bg-accent",
			)}
			onClick={() => incCount()}
		>
			<Image
				src={defaultReactions[id]!.icon}
				alt={defaultReactions[id]!.alt}
				width={20}
				height={20}
			/>
			<span className="tabular-nums">
				{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}
			</span>
		</button>
	);
}

interface AddReactionButtonProps {
	addReaction(id: number): void;
	available: number[];
}

function AddReactionButton({ addReaction, available }: AddReactionButtonProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon">
					<SmilePlus />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-1">
				{available.map((id) => (
					<Button
						key={id}
						onClick={() => addReaction(id)}
						variant="ghost"
						size="icon"
					>
						<Image
							src={defaultReactions[id]!.icon}
							alt={defaultReactions[id]!.alt}
							width={20}
							height={20}
						/>
					</Button>
				))}
			</PopoverContent>
		</Popover>
	);
}
