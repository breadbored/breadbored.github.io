import { GetStaticProps } from "next";
import PostPreview from "../components/PostPreview";
import { getAllPosts, getAllPublishedPosts } from "../utils/post_parser";
import { Post } from "../types";

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
        <div className="posts">
            {posts.map((post) => (
                <PostPreview key={post.slug} post={post} type={"posts"} />
            ))}
        </div>
    );
};

export default Home;
