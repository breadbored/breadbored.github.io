import Image from "next/image";
import Link from "next/link";
import type { Post as PostType } from "../types";

const PostPreview = ({ post, type, index, showPreview = true }: { post: PostType, type: "posts" | "archive", index: number, showPreview?: boolean }) => {
  const date = new Date(post.date);
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="border border-black m-2.5 p-4">
      <Link href={`/${type}/${post.slug}`} className="block">
        {post.chapterHeader ? (
          <>
            <h2 className="text-xl font-semibold mb-1">
              {post.superTitle ? `${post.superTitle}:` : ""} {post.chapterHeader}
            </h2>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          </>
        ) : (
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        )}
        <div className="mb-4">
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </Link>

      {showPreview && <div className="prose max-w-none mb-4">{post.excerpt}</div>}

      <Link href={`/${type}/${post.slug}`} className="block">
        <Image
          src="/assets/more.gif"
          alt="Read more"
          width={88}
          height={31}
          className="inline"
        />
      </Link>
    </article>
  );
};

export default PostPreview;
