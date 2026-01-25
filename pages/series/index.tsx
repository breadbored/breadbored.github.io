import { GetStaticProps } from "next";
import { getAllDraftPosts, getAllPublishedPosts } from "../../utils/post_parser";
import { Post } from "../../types";
import Head from "next/head";
import SeriesItem from "../../components/SeriesItem";

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getAllPublishedPosts();
    const drafts = await getAllDraftPosts();

    const postsAll = posts.map(p => ({ ...p, draft: false }));
    const draftsAll = drafts.map(p => ({ ...p, draft: true }));

    return {
        props: {
            posts: [...postsAll, ...draftsAll],
        },
    };
};

const SeriesIndex = ({ posts }: { posts: Post[] }) => {
    const pageTitle = "Tutorial Series | bread.codes";
    const pageDescription = "Browse all tutorial series on bread.codes, including Game Boy Advance development with Butano and more.";

    const seriesMap: Record<string, Post[]> = {};

    // Group series posts
    for (const post of posts) {
        const isSeries = !!post.chapterHeader;

        if (isSeries) {
            const name = post.slug.split('-series-')[0];
            if (!seriesMap[name]) {
                seriesMap[name] = [];
            }
            seriesMap[name].push(post);
        }
    }

    const seriesArr: { slug: string, title: string, posts: Post[] }[] = Object.keys(seriesMap).map(key => {
        const superTitle = seriesMap[key].find(p => p.superTitle)?.superTitle || "Untitled Series";
        return {
            slug: key,
            title: superTitle,
            posts: seriesMap[key],
        };
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
                    content="bread.codes, breadcodes, tutorial series, programming tutorials, gameboy, game boy advance, butano, game development, gamedev, gbadev"
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
                    <h1 className="text-3xl font-bold">Tutorial Series</h1>
                    <p className="text-gray-600 mt-2">
                        Browse all tutorial series covering game development, programming, and more.
                    </p>
                </header>
                <div className="series-list" role="list">
                    {seriesArr.map((series, i) => (
                        <SeriesItem key={series.slug} series={series} posts={series.posts} index={i} />
                    ))}
                </div>
            </main>
        </>
    );
};

export default SeriesIndex;
