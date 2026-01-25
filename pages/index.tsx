import { GetStaticProps } from "next";
import PostPreview from "../components/PostPreview";
import { getAllPublishedPosts } from "../utils/post_parser";
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
    const pageTitle = "bread.codes";
    const pageDescription = "bread.codes is a blog about code stuff.";

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#333333" />
                <meta name="description" content={pageDescription} />
                <meta name="author" content="BreadCodes" />
                <meta
                    name="keywords"
                    content="bread.codes, breadcodes, breadbored, bread bored, bread, bored, brad, code, codes, programming, web development, software engineering, software, engineering, web, development, blog, tech, technology, computer, science, computer science, game boy, gameboy, game boy advance, GBA, gameboy advance, hacking, reverse engineering, reverse, engineering, pokemon, pokemon hacking, pokemon reverse engineering, nintendo hacking, nintendo reverse engineering, nintendo, gamefreak, game freak"
                />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="google-adsense-account" content="ca-pub-8749505090904262" />
            </Head>
            <main>
                <h1 className="sr-only">{pageTitle}</h1>
                <section aria-label="Blog posts">
                    {posts.map((post, i) => (
                        <PostPreview key={post.slug} post={post} type={"posts"} index={i} />
                    ))}
                </section>
            </main>
        </>
    );
};

export default Home;
