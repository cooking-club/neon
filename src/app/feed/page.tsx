import { api } from "~/trpc/server";
import { Post } from "../_components/new-post";

export default async function Feed() {
  const posts = await api.post.get();

  return (
    <main className="pb-10">
      {posts.map((item) => (
        <Post {...item} key={item.id} />
      ))}
    </main>
  );
}
