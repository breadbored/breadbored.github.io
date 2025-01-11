import type { BSkyPost } from "./utils/bsky";

export type Post = {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  content: string;
  categories: string[];
  skeets: BSkyPost[];
};
