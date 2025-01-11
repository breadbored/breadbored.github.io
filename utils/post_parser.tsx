import { Post as JekyllPost } from '../types';

export function parseJekyllPost(content: string): JekyllPost {
    // Split frontmatter and content
    const parts = content.split('---\n');
    if (parts.length < 3) {
        throw new Error('Invalid Jekyll post format');
    }

    // Parse frontmatter
    const frontmatter = parts[1].split('\n')
        .reduce<Record<string, any>>((acc, line) => {
            const [key, ...values] = line.split(': ');
            if (key && values.length) {
                // Handle arrays in YAML (like categories)
                const value = values.join(': ').trim();
                if (value.startsWith('[') && value.endsWith(']')) {
                    acc[key] = JSON.parse(value.replace(/'/g, '"'));
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {});

    // Get content (everything after second ---)
    const postContent = parts.slice(2).join('---\n').trim();

    // Create slug from title
    const slug = frontmatter.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return {
        title: frontmatter.title,
        date: frontmatter.date,
        slug,
        excerpt: postContent.split('\n\n')[0], // First paragraph as excerpt
        content: postContent,
        categories: frontmatter.categories || []
    };
}

export async function getAllPosts(): Promise<JekyllPost[]> {
    // You'll need to implement the file reading logic here
    // This is just a placeholder example
    const fs = require('fs');
    const path = require('path');
    const postsDirectory = path.join(process.cwd(), '_posts');

    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames.map((fileName: string) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        return parseJekyllPost(fileContents);
    });

    // Sort posts by date
    return posts.sort((post1: JekyllPost, post2: JekyllPost) =>
        new Date(post2.date).getTime() - new Date(post1.date).getTime()
    );
}