"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "~/app/_components/header";
import { Post } from "~/app/_components/post";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface IPost {
	id: number;
	text: string;
	author: string;
	createdAt: Date;
	attachments: string | null;
}

const intersectionOpts = {
	root: null,
	rootMargin: "0px",
	threshold: 1.0,
};

export default function Feed() {
	const [skip, setSkip] = useState(0);
	const [posts, setPosts] = useState<IPost[]>([]);
	const containerRef = useRef(null);
	const hasNewPost = useRef(true);

	const utils = api.useUtils();

	useEffect(() => {
		async function intersectionHandler(entries: IntersectionObserverEntry[]) {
			const [entry] = entries;
			setSkip((s) => s + 1);
		}

		const observer = new IntersectionObserver(
			intersectionHandler,
			intersectionOpts,
		);

		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			if (containerRef.current) observer.unobserve(containerRef.current);
		};
	}, []);

	useEffect(() => {
		async function fetchNextPost() {
			const [nextPost] = await utils.post.get.fetch({
				skip: skip,
				limit: 1,
			});
			if (nextPost !== undefined) setPosts((p) => [...p, nextPost]);
			else hasNewPost.current = false;
		}
		if (hasNewPost.current) fetchNextPost();
	}, [skip, utils]);

	return (
		<>
			<Header />
			<main
				className={cn(
					"pb-10",
					posts.length === 0 && "h-[80vh] overflow-hidden",
				)}
			>
				{posts.length === 0 && (
					<>
						<PostSkeleton />
						<PostSkeleton />
					</>
				)}
				{posts.map((item) => (
					<Post {...item} key={item.id} />
				))}
				<p
					ref={containerRef}
					className={cn("text-center", { hidden: posts.length === 0 })}
				>
					loading more posts...
				</p>
			</main>
		</>
	);
}

function PostSkeleton() {
	return (
		<div className="mx-3 mt-3 px-3 py-3">
			<div className="flex items-center gap-2">
				<Skeleton className="size-12 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
			<Skeleton className="my-2 h-3 w-full" />
			<Skeleton className="my-2 h-3 w-1/3" />
			<Skeleton className="aspect-video w-full" />
		</div>
	);
}
