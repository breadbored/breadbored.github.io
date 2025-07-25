import ReactMarkdown, { ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Post as PostType } from "../types";
import React, {
    ClassAttributes,
    HTMLAttributes,
    ReactElement,
    ReactNode,
    ReactPortal,
    useEffect,
    useState,
} from "react";
import BlueSkyEmbed from "../pages/bsky-test";
import { BSkyPost } from "../utils/bsky";
import hljs from "highlight.js";
import Head from "next/head";
import remarkGfm from 'remark-gfm';

function flatten(
    text: string,
    child:
        | string
        | number
        | bigint
        | ReactElement
        | Iterable<ReactNode>
        | ReactPortal
        | Promise<any>,
): string {
    if (
        typeof child === "string" ||
        typeof child === "number" ||
        typeof child === "bigint"
    ) {
        return text + child;
    } else if (React.isValidElement(child)) {
        return React.Children.toArray(child.props.children).reduce(flatten, text);
    } else {
        return text;
    }
}

function HeadingRenderer(level: number) {
    return (
        props: ClassAttributes<HTMLHeadingElement> &
            HTMLAttributes<HTMLHeadingElement> &
            ExtraProps,
    ): ReactElement => {
        var children = React.Children.toArray(props.children);
        var text = children.reduce(flatten, "");
        var slug = text.toLowerCase().replace(/\W/g, "-");
        return React.createElement("h" + level, { id: slug }, props.children);
    };
}

const BSkyRenderer = (skeets: BSkyPost[]) => (
    props: ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement> &
        ExtraProps,
): ReactElement => {
    const { href, children } = props as any;

    if (href && href.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi)?.length > 0) {
        const skeet = skeets.find((skeet: BSkyPost) => {
            return skeet?.url === href
        });
        if (skeet) {
            return <BlueSkyEmbed post={{
                message: "Post fetched successfully",
                data: skeet,
                lastUpdated: new Date().toISOString(),
            }} />;
        }
    }
    if (children && children.match && children.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi)?.length > 0) {
        const skeet = skeets.find((skeet: BSkyPost) => {
            return skeet?.url === children
        });
        if (skeet) {
            return <BlueSkyEmbed post={{
                message: "Post fetched successfully",
                data: skeet,
                lastUpdated: new Date().toISOString(),
            }} />;
        }
    }

    return <p {...props}>{props.children}</p>;
}

const Post = ({ post }: { post: PostType }) => {
    const [isClient, setIsClient] = useState<boolean>(false);
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    useEffect(() => {
        setIsClient(true);
        hljs.highlightAll();
    }, []);

    return (
        <>
            <Head>
                <title>{post.title} - bread.codes</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#333333" />
                <meta name="title" content="bread.codes" />
                <meta name="author" content="BreadCodes" />
                <meta
                    name="description"
                    content={post.excerpt}
                />
                <meta
                    name="keywords"
                    content={
                        (post.categories && post.categories.length > 0 ? post.categories.join(", ") + ", " : "") +
                        "bread.codes, breadcodes, breadbored, bread bored, bread, bored, brad, code, codes, programming, web development, software engineering, software, engineering, web, development, blog, tech, technology, computer, science, computer science, game boy, gameboy, game boy advance, GBA, gameboy advance, hacking, reverse engineering, reverse, engineering, pokemon, pokemon hacking, pokemon reverse engineering, nintendo hacking, nintendo reverse engineering, nintendo, gamefreak, game freak"
                    }
                />
                <meta name="google-adsense-account" content="ca-pub-8749505090904262" />
            </Head>
            <article className="max-w-2xl mx-auto px-4" style={{
                background: "white",
            }}>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="mb-8 text-gray-600">{formattedDate}</div>
                <div className="prose max-w-none">
                    {!isClient ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            children={post.content}
                            components={{
                                h1: HeadingRenderer(1),
                                h2: HeadingRenderer(2),
                                h3: HeadingRenderer(3),
                                h4: HeadingRenderer(4),
                                h5: HeadingRenderer(5),
                                h6: HeadingRenderer(6),
                                // p: BSkyRenderer(post.skeets),
                            }}
                        />
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            children={post.content}
                            components={{
                                h1: HeadingRenderer(1),
                                h2: HeadingRenderer(2),
                                h3: HeadingRenderer(3),
                                h4: HeadingRenderer(4),
                                h5: HeadingRenderer(5),
                                h6: HeadingRenderer(6),
                                // p: BSkyRenderer(post.skeets),
                            }}
                            rehypePlugins={[rehypeRaw]}
                        />
                    )}
                </div>
            </article>
        </>
    );
};

export default Post;