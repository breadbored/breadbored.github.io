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

const Post = ({ post }: { post: PostType }) => {
    const [isClient, setIsClient] = useState<boolean>(false);
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <article className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="mb-8 text-gray-600">{formattedDate}</div>
            <div className="prose max-w-none">
                {!isClient ? (
                    <ReactMarkdown
                        children={post.content}
                        components={{
                            h1: HeadingRenderer(1),
                            h2: HeadingRenderer(2),
                            h3: HeadingRenderer(3),
                            h4: HeadingRenderer(4),
                            h5: HeadingRenderer(5),
                            h6: HeadingRenderer(6),
                        }}
                    />
                ) : (
                    <ReactMarkdown
                        children={post.content}
                        components={{
                            h1: HeadingRenderer(1),
                            h2: HeadingRenderer(2),
                            h3: HeadingRenderer(3),
                            h4: HeadingRenderer(4),
                            h5: HeadingRenderer(5),
                            h6: HeadingRenderer(6),
                        }}
                        rehypePlugins={[rehypeRaw]}
                    />
                )}
            </div>
        </article>
    );
};

export default Post;