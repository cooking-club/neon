"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import clsx from "clsx";

dayjs.extend(relativeTime);

interface PostProps {
	text: string;
	author: string;
	createdAt: Date;
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

export function Post({ text, author, createdAt }: PostProps) {
	const [imgOpen, setImgOpen] = useState(false);

	return (
		<div className="px-3 mt-3">
			<div className="flex gap-2">
				<Avatar className="h-fit size-12">
					{/* <AvatarImage src={author.avatarURL} /> */}
					<AvatarFallback>
						{author
							.split(" ")
							.map((item) => item.slice(0, 1))
							.join("")}
					</AvatarFallback>
				</Avatar>
				<div className="">
					<h3 className="text-xl font-semibold tracking-tight">{author}</h3>
					<p className="text-muted-foreground text-sm">
						{dayjs().to(createdAt)}
					</p>
				</div>
			</div>
			<p className="my-2 line-clamp-3">{text}</p>
			{/* {attachments ?? (
        <div
          className={clsx(
            "aspect-square rounded bg-center bg-cover",
            post.attachments ?? "hidden"
          )}
          style={{ backgroundImage: `url(${post.attachments?.[0]})` }}
          onClick={() => setImgOpen(true)}
        />
      )} */}
			<div className="flex items-center gap-x-2 gap-y-2 overflow-y-hidden flex-wrap mt-2">
				{defaultReaction.map((item, idx) => (
					<Reaction {...item} key={idx} />
				))}
			</div>
			<hr className="my-4" />
			{imgOpen && (
				<div
					className="fixed top-0 left-0 z-10 grid h-screen w-screen items-center bg-background-overlay"
					onClick={() => setImgOpen(false)}
					onKeyDown={() => setImgOpen(false)}
				>
					{/* <img className="" src={attachments?.[0]} /> */}
				</div>
			)}
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
