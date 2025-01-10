import { GetStaticPaths, GetStaticProps } from 'next'
import ReactMarkdown from 'react-markdown'
import { Post as PostType } from '../../types'
import { getAllPosts } from '../../utils/post_parser'

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getAllPosts()

    return {
        paths: posts.map(post => ({
            params: { slug: post.slug }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const posts = await getAllPosts()
    const post = posts.find(p => p.slug === params?.slug)

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post
        }
    }
}

const Post = ({ post }: { post: PostType }) => {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <article className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="mb-8 text-gray-600">{formattedDate}</div>
            <div className="prose max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
        </article>
    )
}

export default Post