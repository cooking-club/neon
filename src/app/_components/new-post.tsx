"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PostProps {
  text: string;
  author: string;
  createdAt: Date;
}

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
      {/* <div className="flex items-center gap-x-2 gap-y-2 overflow-y-hidden flex-wrap mt-2">
        {defaultReaction.map((item) => (
          <Reaction initCount={item.initCount} icon={item.icon} />
        ))}
      </div> */}
      <hr className="my-4" />
      {imgOpen && (
        <div
          className="fixed z-10 top-0 left-0 h-screen w-screen grid items-center bg-background-overlay"
          onClick={() => setImgOpen(false)}
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
}

function Reaction({ initCount, icon }: ReactionProps) {
  const [count, setCount] = useState(initCount);

  return (
    <button
      className="flex items-center gap-2 bg-background px-4 py-2 border rounded-full hover:bg-accent leading-none"
      onClick={() => setCount((c) => c + Math.ceil(Math.random() * 1))}
    >
      {icon}
      <span>{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}</span>
    </button>
  );
}
