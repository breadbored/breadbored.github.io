import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Post as PostType } from './types';

interface RouteParams {
    slug: string;
}

interface PostData extends PostType {
    content: string;
}

interface FrontMatter {
    title: string;
    date: string;
    categories?: string;
    author?: string;
    last_modified_at?: string;
    [key: string]: string | undefined;
}

const Post: React.FC = () => {
    // const [post, setPost] = useState<PostData | null>(null);
    // const { slug } = useParams<{ slug: string | undefined }>();

    // useEffect(() => {
    //     const fetchPost = async () => {
    //         if (!slug) return;

    //         try {
    //             const response = await fetch(`${process.env.PUBLIC_URL}/content/posts/${slug}.md`);
    //             const text = await response.text();

    //             // Parse frontmatter and content
    //             const [, frontmatter, content] = text.split('---');
    //             const metadata: FrontMatter = Object.fromEntries(
    //                 frontmatter.trim().split('\n')
    //                     .map(line => {
    //                         const [key, ...valueParts] = line.split(': ');
    //                         return [key.trim(), valueParts.join(': ').trim()];
    //                     })
    //             );

    //             setPost({
    //                 ...metadata,
    //                 content,
    //                 slug,
    //                 categories: metadata.categories?.split(',').map(cat => cat.trim()) || [],
    //             });
    //         } catch (error) {
    //             console.error('Error fetching post:', error);
    //         }
    //     };

    //     fetchPost();
    // }, [slug]);

    // if (!post) return <div>Loading...</div>;

    // const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    //     month: 'long',
    //     day: 'numeric',
    //     year: 'numeric'
    // });

    return (
        <article className="post detailed max-w-4xl mx-auto">
            {/* <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

            <div className="mb-6">
                <p className="text-gray-600">
                    {post.author} · {formattedDate}
                </p>

                {post.last_modified_at && (
                    <p className="text-gray-600">
                        (Updated: {new Date(post.last_modified_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })})
                    </p>
                )}

                {post.categories.length > 0 && (
                    <div className="post-tags mt-2">
                        {post.categories.map(category => (
                            <Link
                                key={category}
                                to={`/categories#${category.toLowerCase()}`}
                                className="mr-2 text-blue-600 hover:text-blue-800"
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="prose max-w-none mb-8">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="mb-6">
                <p>
                    <span className="mr-2">Share:</span>
                    <a
                        href={`https://bsky.app/intent/compose?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        BlueSky
                    </a>
                    {', '}
                    <a
                        href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Facebook
                    </a>
                </p>
            </div>

            <div className="mb-6">
                <a
                    href="https://www.patreon.com/bePatron?u=34519148"
                    data-patreon-widget-type="become-patron-button"
                    className="inline-block"
                >
                    Become a Patron!
                </a>
                <script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
            </div> */}
        </article>
    );
};

export default Post;