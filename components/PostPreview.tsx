import Image from 'next/image'
import Link from 'next/link'
import type { Post as PostType } from '../types'

const PostPreview = ({ post }: { post: PostType }) => {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <article className="border border-black m-2.5 p-4">
            <Link href={`/posts/${post.slug}`} className="block">
                <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                <div className="mb-4">
                    <p className="text-gray-600">{formattedDate}</p>
                </div>
            </Link>

            <div className="prose max-w-none mb-4">
                {post.excerpt}
            </div>

            <Link href={`/posts/${post.slug}`} className="block">
                <Image src="/assets/more.gif" alt="Read more" width={88} height={31} className="inline" />
            </Link>
        </article>
    )
}

export default PostPreview