import Link from "next/link";
import { Post } from "../types";
import PostPreview from "./PostPreview";
import React from "react";

const SeriesItem = ({ series, index, posts }: { series: { slug: string, title: string }, index: number, posts: Post[] }) => {
  const sortedPosts = posts
    .filter(post => post.superTitle === series.title)
    .sort((a, b) => {
      const chapterA = a.chapterHeader ? parseInt(a.chapterHeader.replace("Chapter ", "")) : 0;
      const chapterB = b.chapterHeader ? parseInt(b.chapterHeader.replace("Chapter ", "")) : 0;
      return chapterA - chapterB;
    });

  return (
    <section className="border border-black m-2.5 p-4" aria-labelledby={`series-${series.slug}`}>
      <header>
        <h2 id={`series-${series.slug}`} className="text-2xl font-bold mb-2">
          <Link href={`/series/${series.slug}`}>{series.title}</Link>
        </h2>
      </header>

      <div className="posts" role="list">
        {sortedPosts.map((post, i) => {
          const p = {
            ...post,
            superTitle: undefined,
          };
          return (
            <React.Fragment key={post.slug}>
              {i !== 0 && <hr className="my-4 border-black" />}
              <PostPreview post={p} type={"posts"} index={i} showPreview={false} />
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};

export default SeriesItem;
