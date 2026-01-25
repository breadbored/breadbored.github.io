import { GetStaticProps } from "next";
import PostPreview from "../../../components/PostPreview";
import { getAllPublishedPosts } from "../../../utils/post_parser";
import { Post } from "../../../types";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getAllPublishedPosts();

    return {
        props: {
            posts,
        },
    };
};

const ButanoSeries = ({ posts }: { posts: Post[] }) => {
    const pageTitle = "Butano Series | bread.codes";
    const pageDescription = "bread.codes's series on Butano, a modern C++ high-level engine for Game Boy Advance homebrew development.";

    const butanoPosts = posts
        .filter(post => post.superTitle === "Butano Series")
        .sort((a, b) => {
            const chapterA = a.chapterHeader ? parseInt(a.chapterHeader.replace("Chapter ", "")) : 0;
            const chapterB = b.chapterHeader ? parseInt(b.chapterHeader.replace("Chapter ", "")) : 0;
            return chapterA - chapterB;
        });

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
                    content="bread.codes, breadcodes, breadbored, gameboy, game boy, gba, game boy advance, butano, butano series, butano tutorial, butano guide, game development, gamedev, nintendo, nintendo gba, nintendo game boy advance, gameboy advance, game boy advance, gbadev, gbdev"
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
                <header className="mb-6 p-4">
                    <h1 className="text-3xl font-bold">Butano Series</h1>
                    <p className="text-gray-600 mt-2">
                        A tutorial series on Butano, a modern C++ high-level engine for Game Boy Advance homebrew development.
                    </p>
                </header>
                <section aria-label="Butano tutorial chapters">
                    {butanoPosts.map((post, i) => (
                        <PostPreview key={post.slug} post={post} type={"posts"} index={i} showPreview={false} />
                    ))}
                </section>
            </main>
        </>
    );
};

export default ButanoSeries;
