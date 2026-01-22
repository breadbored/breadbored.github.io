import { GetStaticPaths, GetStaticProps } from "next";
import { getAllDraftPosts, getAllPublishedPosts } from "../../utils/post_parser";
import Post from "../../components/Post";
import { BskyAgent, BSkyPost, getBskyImageUrl, initializeBskySession, parseBskyUrl, ParsedBskyUrl } from "../../utils/bsky";
import fs from 'fs';
import path from 'path';
import { BlobRef } from '@atproto/api';

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllDraftPosts();

    return {
        paths: posts.map((post) => ({
            params: { slug: post.slug },
        })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const posts = await getAllDraftPosts();
    const post = posts.find((p) => p.slug === params?.slug);

    if (
        post?.content.match(
            /https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?/gi
        )
    ) {
        const agent = new BskyAgent({
            service: 'https://bsky.social'
        })
        const _session = await initializeBskySession(agent)
        const allMatches = post.content.match(
            /https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?/gi
        )
        const urls: (ParsedBskyUrl & {
            url?: string
        })[] = allMatches?.map((url) => {
            // Parse the URL to get handle and rkey
            return {
                url,
                ...parseBskyUrl(url)
            }
        }).filter((url) => {
            return url !== undefined
        }) || [] as ParsedBskyUrl[]

        const posts: BSkyPost[] = []
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i]
            const { handle, rkey, url: urlStr } = url

            const profile = await agent.getProfile({ actor: handle })
            const did = profile.data.did

            const post = await agent.getPost({
                repo: did,
                rkey: rkey,
            })

            if (post.value.embed && (post.value.embed.images as BlobRef[])?.length > 0) {
                for (let j = 0; j < (post.value.embed.images as BlobRef[])?.length; j++) {
                    const data = (post.value.embed.images as { image?: BlobRef, image_url?: string }[])[j]
                    const image = data.image

                    if (!image) {
                        continue
                    }

                    try {
                        // download image from url and save to /public/bsky/images
                        const url = getBskyImageUrl(profile.data.did, image)
                        const response = await fetch(url)
                        const buffer = await response.arrayBuffer()
                        const filename = `${params?.slug}-${i}-${j}.jpg`
                        // make directory if it doesn't exist
                        if (!fs.existsSync(path.join(process.cwd(), 'public', 'bsky', 'images'))) {
                            fs.mkdirSync(path.join(process.cwd(), 'public', 'bsky', 'images'), { recursive: true })
                        }
                        const filePath = path.join(process.cwd(), 'public', 'bsky', 'images', filename)
                        fs.writeFileSync(filePath, Buffer.from(buffer))
                        data.image_url = `/bsky/images/${filename}`
                    } catch (error) {
                        console.error("Failed to download image", error)
                    }

                    delete data.image
                }
            }
            posts.push({
                url: urlStr,
                uri: post.uri,
                text: post.value.text,
                author: {
                    did: profile.data.did,
                    handle: profile.data.handle,
                    displayName: profile.data.displayName,
                    avatar: profile.data.avatar,
                },
                createdAt: post.value.createdAt,
                embed: post.value.embed || null,
                indexedAt: typeof post.value.indexedAt === 'string' ? post.value.indexedAt : null,
            } as BSkyPost)
        }

        post.skeets = posts as BSkyPost[]
    }

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
    };
};

export default Post;
