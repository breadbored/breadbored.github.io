import { GetStaticProps } from "next";
import PostPreview from "../../components/PostPreview";
import { getAllArchivedPosts, getAllPosts, getAllPublishedPosts } from "../../utils/post_parser";
import { Post } from "../../types";

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getAllArchivedPosts();

    return {
        props: {
            posts,
        },
    };
};

const Archived = ({ posts }: { posts: Post[] }) => {
    return (
        <div className="posts">
            {posts.map((post) => (
                <PostPreview key={post.slug} post={post} type={"archive"} />
            ))}
        </div>
    );
};

export default Archived;
