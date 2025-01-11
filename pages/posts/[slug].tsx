import { GetStaticPaths, GetStaticProps } from "next";
import { getAllPublishedPosts } from "../../utils/post_parser";
import Post from "../../components/Post";

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllPublishedPosts();

    return {
        paths: posts.map((post) => ({
            params: { slug: post.slug },
        })),
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const posts = await getAllPublishedPosts();
    const post = posts.find((p) => p.slug === params?.slug);

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
