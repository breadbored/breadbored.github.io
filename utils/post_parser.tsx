import { Post as JekyllPost } from "../types";

function processIncludes(content: string): string {
  const fs = require("fs");
  const path = require("path");

  // Match {{file_path}} pattern
  const includePattern = /\{\{([^}]+)\}\}/g;

  return content.replace(includePattern, (match, filePath) => {
    try {
      const trimmedPath = filePath.trim();
      const fullPath = path.join(process.cwd(), trimmedPath);

      // Read the file content
      const includedContent = fs.readFileSync(fullPath, "utf8");

      // Recursively process includes in the included file
      return processIncludes(includedContent);
    } catch (error) {
      console.error(`Failed to include file: ${filePath}`, error);
      return match; // Return original if file can't be read
    }
  });
}

export function parseJekyllPost(content: string): JekyllPost {
  // Split frontmatter and content
  const parts = content.split("---\n");
  if (parts.length < 3) {
    throw new Error("Invalid Jekyll post format");
  }

  // Parse frontmatter
  const frontmatter = parts[1]
    .split("\n")
    .reduce<Record<string, any>>((acc, line) => {
      const [key, ...values] = line.split(": ");
      if (key && values.length) {
        // Handle arrays in YAML (like categories)
        const value = values.join(": ").trim();
        if (value.startsWith("[") && value.endsWith("]")) {
          acc[key] = JSON.parse(value.replace(/'/g, '"'));
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

  // Get content (everything after second ---)
  let postContent = parts.slice(2).join("---\n").trim();

  // Process file includes
  postContent = processIncludes(postContent);

  // Create slug from title
  const slug = frontmatter.slug || frontmatter.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    superTitle: frontmatter["super-title"] || null,
    title: frontmatter.title,
    date: frontmatter.date,
    align: frontmatter.align || 'center',
    wider: frontmatter.wider || false,
    slug,
    excerpt: postContent.split("\n\n")[0], // First paragraph as excerpt
    content: postContent,
    categories: frontmatter.categories || [],
    skeets: [],
  };
}

export async function getAllPosts(dir: string): Promise<JekyllPost[]> {
  // You'll need to implement the file reading logic here
  // This is just a placeholder example
  const fs = require("fs");
  const path = require("path");
  const postsDirectory = path.join(process.cwd(), dir);

  const fileNames = fs.readdirSync(postsDirectory);

  const seriesMap: Record<string, JekyllPost[]> = {};

  const posts: JekyllPost[] = fileNames
    .filter((fileName: string) => {
      const fullPath = path.join(postsDirectory, fileName);
      // Only process files, not directories
      return fs.statSync(fullPath).isFile() && fileName.endsWith('.md');
    })
    .map((fileName: string) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      return parseJekyllPost(fileContents);
    });

  // Group series posts
  for (const post of posts) {
    const isSeries = !!post.superTitle

    if (isSeries) {
      const name = post.slug.split('-series-')[0];
      if (!seriesMap[name]) {
        seriesMap[name] = [];
      }
      seriesMap[name].push(post);
    }
  }

  // Attach series posts to each post
  for (const post of posts) {
    const isSeries = !!post.superTitle

    if (isSeries) {
      const name = post.slug.split('-series-')[0];
      post.otherInSeries = seriesMap[name].map(p => {
        const { otherInSeries, ...otherPost } = p
        return {
          ...otherPost,
        }
      });
    }
  }

  // Sort posts by date
  return posts.sort(
    (post1: JekyllPost, post2: JekyllPost) =>
      new Date(post2.date).getTime() - new Date(post1.date).getTime(),
  );
}

export async function getAllPublishedPosts(): Promise<JekyllPost[]> {
  return await getAllPosts("_posts");
}

export async function getAllArchivedPosts(): Promise<JekyllPost[]> {
  return await getAllPosts("_archived");
}
