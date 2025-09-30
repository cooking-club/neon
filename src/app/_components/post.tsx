"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SmilePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

dayjs.extend(relativeTime);

interface PostProps {
	text: string;
	author: string;
	createdAt: Date;
	attachments: string | null; // todo: add media types
	reactions: {
		id: number;
		kind: number;
		count: number;
	}[];
	id: number;
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
	kind: number;
	count: number;
	active: boolean;
};

export function Post({
	text,
	author,
	createdAt,
	attachments,
	reactions: initReactions,
	id: postId,
}: PostProps) {
	const [imgOpen, setImgOpen] = useState(false);
	const [reactions, setReactions] = useState<ReactionItemType[]>(
		initReactions.map((item) => ({ ...item, active: false })),
	);

	const available = useMemo(() => {
		return defaultReactions
			.map((_, idx) => idx)
			.filter((kind) => !reactions.some((v) => v.kind === kind));
	}, [reactions]);

	const updReact = (id: number, d: 1 | -1) =>
		setReactions((r) =>
			r.map((item) =>
				item.id === id
					? {
							...item,
							count: item.count + d,
							active: !item.active,
						}
					: item,
			),
		);

	const newReact = api.reaction.new.useMutation({
		onSuccess: ({ id, kind }) =>
			setReactions((r) => [...r, { id, count: 1, active: true, kind: kind }]),
	});

	const addReact = api.reaction.add.useMutation({
		onSuccess: ({ id }) => updReact(id, 1),
	});

	const delReact = api.reaction.remove.useMutation({
		onSuccess: ({ id }) => updReact(id, -1),
	});

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
					{attachments.endsWith("mp4") ? (
						<video
							className="aspect-square w-full rounded object-cover object-center"
							loop
							autoPlay
							muted
							playsInline
						>
							<source src={attachments} type="video/mp4" />
						</video>
					) : (
						<img
							className="aspect-square w-full rounded object-cover object-center"
							alt=""
							src={attachments}
							onClick={() => setImgOpen(true)}
							onKeyDown={() => setImgOpen(true)}
						/>
					)}
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
				{reactions.map((item) => (
					<Reaction
						{...item}
						key={item.id}
						onClick={() => {
							if (item.active) {
								delReact.mutate({ id: item.id });
							} else {
								addReact.mutate({ id: item.id });
							}
						}}
					/>
				))}
				{reactions.length !== defaultReactions.length && (
					<AddReactionButton
						addReaction={(kind: number) => newReact.mutate({ postId, kind })}
						available={available}
					/>
				)}
			</div>
		</div>
	);
}

interface ReactionProps {
	active: boolean;
	count: number;
	kind: number;
	onClick(): void;
}

function Reaction({ active, count, onClick, kind }: ReactionProps) {
	return (
		<button
			type="button"
			className={cn(
				"flex items-center gap-2 rounded-full border bg-background px-4 py-2 leading-none",
				active && "bg-accent",
			)}
			onClick={onClick}
		>
			<Image
				src={defaultReactions[kind]!.icon}
				alt={defaultReactions[kind]!.alt}
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
