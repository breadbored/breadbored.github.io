import { GetStaticProps } from "next";
import PostPreview from "../../components/PostPreview";
import { getAllPosts, getAllPublishedPosts } from "../../utils/post_parser";
import { Post } from "../../types";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getAllPublishedPosts();

    return {
        props: {
            posts,
        },
    };
};

const Home = ({ posts }: { posts: Post[] }) => {
    return (
        <>
            <Head>
                <title>bread.codes's Butano Series</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#333333" />
                <meta name="title" content="bread.codes" />
                <meta name="author" content="BreadCodes" />
                <meta
                    name="description"
                    content="bread.codes's series on Butano, a modern C++ high-level engine for Game Boy Advance homebrew development."
                />
                <meta
                    name="keywords"
                    content="bread.codes, breadcodes, breadbored, gameboy, game boy, gba, game boy advance, butano, butano series, butano tutorial, butano guide, game development, gamedev, nintendo, nintendo gba, nintendo game boy advance, gameboy advance, game boy advance, gbadev, gbdev"
                />
                <meta name="google-adsense-account" content="ca-pub-8749505090904262" />
            </Head>
            <div className="posts">
                {posts.filter(post => post.superTitle === "Butano Series").sort((a, b) => {
                    const chapterA = a.chapterHeader ? parseInt(a.chapterHeader.replace("Chapter ", "")) : 0;
                    const chapterB = b.chapterHeader ? parseInt(b.chapterHeader.replace("Chapter ", "")) : 0;
                    return chapterA - chapterB;
                }).map((post, i) => (
                    <PostPreview key={post.slug} post={post} type={"posts"} index={i} showPreview={false} />
                ))}
            </div>
        </>
    );
};

export default Home;
