"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

dayjs.extend(relativeTime);

interface PostProps {
	text: string;
	author: string;
	createdAt: Date;
	attachments: string | null; // todo: add media types
}

const defaultReaction: ReactionProps[] = [
	{ initCount: 0, icon: "/grinning.png", alt: "Grinning emoji" },
	{ initCount: 0, icon: "/fire.png", alt: "Fire emoji" },
	{ initCount: 0, icon: "/heart.png", alt: "Heart emoji" },
	{
		initCount: 0,
		icon: "/smiling_with_tear.png",
		alt: "Smilling face with tears emoji",
	},
	{ initCount: 0, icon: "/peach.png", alt: "Peach emoji" },
	{ initCount: 0, icon: "/eggplant.png", alt: "Eggplant emoji" },
];

export function Post({ text, author, createdAt, attachments }: PostProps) {
	const [imgOpen, setImgOpen] = useState(false);

	return (
		<div className="mt-3 px-3">
			<div className="flex gap-2">
				<Avatar className="size-12 h-fit">
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
				{defaultReaction.map((item, idx) => (
					<Reaction {...item} key={idx} />
				))}
			</div>
			<hr className="my-4" />
		</div>
	);
}

interface ReactionProps {
	initCount: number;
	icon: string;
	alt: string;
}

function Reaction({ initCount, icon, alt }: ReactionProps) {
	const [count, setCount] = useState(initCount);

	return (
		<button
			type="button"
			className={clsx(
				"flex items-center gap-2 rounded-full border bg-background px-4 py-2 leading-none hover:bg-accent",
				count === 0 && "opacity-60",
			)}
			onClick={() => setCount((c) => c + Math.ceil(Math.random() * 1))}
		>
			<Image src={icon} alt={alt} width={20} height={20} />
			<span className="tabular-nums">
				{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}
			</span>
		</button>
	);
}
