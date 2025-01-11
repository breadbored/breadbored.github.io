import { GetStaticPaths, GetStaticProps } from 'next'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw"
import { Post as PostType } from '../../types'
import { getAllPosts } from '../../utils/post_parser'
import { useEffect, useState } from 'react'

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
    const [isClient, setIsClient] = useState<boolean>(false)
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <article className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="mb-8 text-gray-600">{formattedDate}</div>
            <div className="prose max-w-none">
                {!isClient ? <ReactMarkdown children={post.content} /> : <ReactMarkdown children={post.content} rehypePlugins={[rehypeRaw]} />}
            </div>
        </article>
    )
}

export default Post