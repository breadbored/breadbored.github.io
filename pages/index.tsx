import { GetStaticProps } from "next";
import PostPreview from "../components/PostPreview";
import { getAllPosts, getAllPublishedPosts } from "../utils/post_parser";
import { Post } from "../types";
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
                <title>bread.codes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#333333" />
                <meta name="title" content="bread.codes" />
                <meta name="author" content="BreadCodes" />
                <meta
                    name="description"
                    content="bread.codes is a blog about code stuff."
                />
                <meta
                    name="keywords"
                    content="bread.codes, breadcodes, breadbored, bread bored, bread, bored, brad, code, codes, programming, web development, software engineering, software, engineering, web, development, blog, tech, technology, computer, science, computer science, game boy, gameboy, game boy advance, GBA, gameboy advance, hacking, reverse engineering, reverse, engineering, pokemon, pokemon hacking, pokemon reverse engineering, nintendo hacking, nintendo reverse engineering, nintendo, gamefreak, game freak"
                />
                <meta name="google-adsense-account" content="ca-pub-8749505090904262" />
            </Head>
            <div className="posts">
                {posts.map((post) => (
                    <PostPreview key={post.slug} post={post} type={"posts"} />
                ))}
            </div>
        </>
    );
};

export default Home;
