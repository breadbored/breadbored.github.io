import type { BSkyPost } from "./utils/bsky";

export type Post = {
  chapterHeader?: string | null;
  superTitle?: string | null;
  title: string;
  date: string;
  slug: string;
  align?: "center" | "left" | "right";
  wider?: boolean;
  excerpt: string;
  content: string;
  categories: string[];
  skeets: BSkyPost[];
  otherInSeries?: Post[];
  draft?: boolean;
};
