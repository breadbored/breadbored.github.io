import Link from "next/link";
import type { Post as PostType } from "../types";

const PostPreview = ({ post, type, index, showPreview = true }: { post: PostType, type: "posts" | "archive" | "drafts", index: number, showPreview?: boolean }) => {
  const date = new Date(post.date);
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  const isoDate = date.toISOString().split('T')[0];
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const postUrl = `/${post.draft ? "drafts" : type}/${post.slug}`;
  const isAccessible = !post.draft || type === "drafts";

  return (
    <article className="border border-black m-2.5 p-4">
      <header>
        {post.chapterHeader && (
          <p className="text-xl font-semibold mb-1">
            {post.superTitle ? `${post.superTitle}: ` : ""}{post.chapterHeader}
          </p>
        )}
        <h2 className="text-2xl font-bold mb-2">
          {isAccessible ? (
            <Link href={postUrl}>{post.title}</Link>
          ) : (
            post.title
          )}
        </h2>
        <time dateTime={isoDate} className="text-gray-600 block mb-4">
          {formattedDate}
        </time>
      </header>

      {!post.draft && showPreview && post.excerpt && (
        <p className="prose max-w-none mb-4">{post.excerpt}</p>
      )}

      <footer>
        {isAccessible ? (
          <Link
            href={postUrl}
            className="block pixel-font-fancy underline"
            aria-label={`Read full article: ${post.title}`}
          >
            Read More
          </Link>
        ) : (
          <p className="block pixel-font">In Progress & Coming Soon</p>
        )}
      </footer>
    </article>
  );
};

export default PostPreview;
