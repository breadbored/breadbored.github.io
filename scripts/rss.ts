import { getAllPosts } from "../utils/post_parser";
import { Feed } from "feed";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const feed = new Feed({
    title: "BreadCodes",
    description: "code stuff",
    id: "https://bread.codes/",
    link: "https://bread.codes/",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://bread.codes/image.png",
    favicon: "https://bread.codes/favicon.ico",
    copyright: "All rights reserved 2025, BreadCodes",
    updated: new Date(),
    generator: "feed",
    feedLinks: {
        json: "https://bread.codes/json",
        atom: "https://bread.codes/atom"
    },
    author: {
        name: "BreadCodes",
        email: "brad@bread.codes",
        link: "https://bread.codes/about"
    }
});

async function generateRSSFeed() {
    try {
        const posts = await getAllPosts("_posts");
        const archived = await getAllPosts("_archived");

        posts.forEach(post => {
            feed.addItem({
                title: post.chapterHeader ? `${post.chapterHeader}: ${post.title}` : post.title,
                id: post.slug,
                link: `https://bread.codes/posts/${post.slug}`,
                description: post.excerpt,
                content: post.content,
                author: [
                    {
                        name: "BreadCodes",
                        email: "brad@bread.codes",
                        link: "https://bread.codes/about"
                    }
                ],
                contributor: [],
                date: new Date(post.date),
                image: undefined,
            });
        });

        // Output: RSS 2.0
        fs.writeFileSync('public/rss.xml', feed.rss2());
        fs.writeFileSync('public/feed.xml', feed.rss2());

        // Output: Atom 1.0
        fs.writeFileSync('public/atom.xml', feed.atom1());
        fs.writeFileSync('public/feed.atom', feed.atom1());

        // Output: JSON Feed 1.0
        fs.writeFileSync('public/feed.json', feed.json1());

        process.exit(0);
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        process.exit(1);
    }
}

generateRSSFeed();
