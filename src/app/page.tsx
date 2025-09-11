import { Header } from "~/app/_components/header";
import { Post } from "~/app/_components/post";
import { api } from "~/trpc/server";

export default async function Feed() {
	const posts = await api.post.get();

	return (
		<>
			<Header />
			<main className="pb-10">
				{posts.map((item) => (
					<Post {...item} key={item.id} />
				))}
			</main>
		</>
	);
}
