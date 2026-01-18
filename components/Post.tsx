import ReactMarkdown, { ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Post as PostType } from "../types";
import React, {
  ClassAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BlueSkyEmbed from "../pages/bsky-test";
import { BSkyPost } from "../utils/bsky";
import hljs from "highlight.js";
import Head from "next/head";
import remarkGfm from "remark-gfm";

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

function NextPrev({ params }: { params: string[] }) {
  const [prevTitle, prevLink, nextTitle, nextLink] = params;

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
      marginBottom: '2rem',
    }}>
      {prevTitle && prevLink && (
        <a href={prevLink} style={{
          flex: 1,
          padding: '1rem',
          border: '2px solid #333',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'background-color 0.2s',
        }}>
          <div style={{ fontSize: '1.5rem' }}>←</div>
          <div>{prevTitle}</div>
        </a>
      )}
      {nextTitle && nextLink && (
        <a href={nextLink} style={{
          flex: 1,
          padding: '1rem',
          border: '2px solid #333',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'background-color 0.2s',
        }}>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div>{nextTitle}</div>
        </a>
      )}
    </div>
  )
}

function ComponentInterceptor() {
  return (
    props: ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement> &
      ExtraProps,
  ): ReactElement => {
    var children = React.Children.toArray(props.children);
    var text = children.reduce(flatten, "");

    if (typeof props.children === "string" || typeof (props.children as unknown as undefined | (string | undefined)[])?.[0] === "string") {
      const fullText = (
        (props.children as unknown as string | undefined) || (props.children as unknown as undefined | (string | undefined)[])?.[0]
      )?.trim() || "";

      const firstSpaceIndex = fullText.indexOf(' ');
      const componentName = firstSpaceIndex === -1 ? fullText : fullText.substring(0, firstSpaceIndex);
      const paramsText = firstSpaceIndex === -1 ? "" : fullText.substring(firstSpaceIndex + 1);

      // Parse comma-separated quoted strings
      const parseParams = (text: string): string[] => {
        const params: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            params.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }

        if (current.trim()) {
          params.push(current.trim());
        }

        return params;
      };

      const params = parseParams(paramsText);

      switch (componentName) {
        case "NextPrev":
          return <NextPrev params={params} />;
        default:
          break;
      }
    }

    const level = 6;
    var slug = text.toLowerCase().replace(/\W/g, "-");

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.history.pushState({}, "", `#${slug}`);
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
    };

    return React.createElement(
      "h" + level,
      {
        id: slug,
        className: "heading-anchor-wrapper"
      },
      React.createElement(
        "a",
        {
          href: `#${slug}`,
          onClick: handleClick,
          className: "heading-anchor",
          style: {
            textDecoration: "none",
            color: "inherit",
            display: "inline-flex",
            alignItems: "center",
            position: "relative"
          }
        },
        props.children,
        React.createElement(
          "span",
          {
            className: "heading-anchor-hash",
            style: {
              opacity: 0,
              marginLeft: "0.5rem",
              transition: "opacity 0.2s",
              color: "#666",
              fontSize: "0.8em"
            }
          },
          "#"
        )
      )
    );
  };
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

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.history.pushState({}, "", `#${slug}`);
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
    };

    return React.createElement(
      "h" + level,
      {
        id: slug,
        className: "heading-anchor-wrapper"
      },
      React.createElement(
        "a",
        {
          href: `#${slug}`,
          onClick: handleClick,
          className: "heading-anchor",
          style: {
            textDecoration: "none",
            color: "inherit",
            display: "inline-flex",
            alignItems: "center",
            position: "relative"
          }
        },
        props.children,
        React.createElement(
          "span",
          {
            className: "heading-anchor-hash",
            style: {
              opacity: 0,
              marginLeft: "0.5rem",
              transition: "opacity 0.2s",
              color: "#666",
              fontSize: "0.8em"
            }
          },
          "#"
        )
      )
    );
  };
}

function CodeRenderer({ slug }: { slug: string }) {
  return (
    props: ClassAttributes<HTMLHeadingElement> &
      HTMLAttributes<HTMLHeadingElement> &
      ExtraProps,
  ): ReactElement => {
    var children = React.Children.toArray(props.children);
    var text = children.reduce(flatten, "");
    if (text.includes("\n")) {
      return React.createElement(
        "code",
        {
          id: slug
        },
        React.createElement("pre", {
          id: `${slug}-pre`
        }, props.children),
      );
    }
    return React.createElement(
      "span",
      {
        id: `${slug}`,
        className: "inline-code",
        style: {
          background: "#333",
          borderRadius: "5px",
          color: "orange",
          padding: "0 6px",
          margin: "0 3px",
        }
      },
      props.children,
    );
  };
}

const BSkyRenderer =
  (skeets: BSkyPost[]) =>
    (
      props: ClassAttributes<HTMLDivElement> &
        HTMLAttributes<HTMLDivElement> &
        ExtraProps,
    ): ReactElement => {
      const { href, children } = props as any;

      if (
        href &&
        href.match(
          /^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi,
        )?.length > 0
      ) {
        const skeet = skeets.find((skeet: BSkyPost) => {
          return skeet?.url === href;
        });
        if (skeet) {
          return (
            <BlueSkyEmbed
              post={{
                message: "Post fetched successfully",
                data: skeet,
                lastUpdated: new Date().toISOString(),
              }}
            />
          );
        }
      }
      if (
        children &&
        children.match &&
        children.match(
          /^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/gi,
        )?.length > 0
      ) {
        const skeet = skeets.find((skeet: BSkyPost) => {
          return skeet?.url === children;
        });
        if (skeet) {
          return (
            <BlueSkyEmbed
              post={{
                message: "Post fetched successfully",
                data: skeet,
                lastUpdated: new Date().toISOString(),
              }}
            />
          );
        }
      }

      return <p {...props}>{props.children}</p>;
    };

const Post = ({ post }: { post: PostType }) => {
  const borderText = "`~,~";
  const hrWidthRef = useRef<HTMLHRElement>(null);
  const [hrWidth, setHrWidth] = useState<number>(-1);
  const [isClient, setIsClient] = useState<boolean>(false);
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    setIsClient(true);
    hljs.highlightAll();

    // css select `.page-width` and set class `wider` if post.wider is true
    const pageWidthDiv = document.querySelector(".page-width");
    if (pageWidthDiv && post.wider) {
      pageWidthDiv.classList.add("wider");
    }

    return () => {
      if (pageWidthDiv && post.wider) {
        pageWidthDiv.classList.remove("wider");
      }
    }
  }, []);

  const hrResizeListener = useCallback(() => {
    if (hrWidthRef.current) {
      setHrWidth(hrWidthRef.current.offsetWidth);
    }
  }, [hrWidthRef]);

  useEffect(() => {
    // listen for the width of the hrWidthRef changing
    window?.addEventListener("resize", hrResizeListener);
    hrResizeListener();

    return () => {
      window?.removeEventListener("resize", hrResizeListener);
    };
  }, [])

  return (
    <>
      <Head>
        <title>{post.superTitle ? `${post.superTitle}: ${post.title}` : post.title} - bread.codes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#333333" />
        <meta name="title" content="bread.codes" />
        <meta name="author" content="BreadCodes" />
        <meta name="description" content={post.excerpt} />
        <meta
          name="keywords"
          content={
            (post.categories && post.categories.length > 0
              ? post.categories.join(", ") + ", "
              : "") +
            "bread.codes, breadcodes, breadbored, programming, engineering, software, engineering, development, blog, tech, technology, computer science, game boy, gameboy, game boy advance, GBA, gameboy advance, hacking, reverse engineering, reverse, engineering, pokemon, pokemon hacking, pokemon reverse engineering, nintendo hacking, nintendo reverse engineering, nintendo, gamefreak, game freak"
          }
        />
        <meta name="google-adsense-account" content="ca-pub-8749505090904262" />
      </Head>
      <article
        className={`${post.wider ? "max-w-4xl" : "max-w-2xl"} mx-auto px-4`}
        style={{
          background: "white",
        }}
      >
        {post.superTitle && (
          <h1 className="text-2xl font-semibold mb-2">{post.superTitle}</h1>
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="mb-8 text-gray-600 pixel-font">{formattedDate}</div>
        <div
          className={`prose max-w-none ${post.align == "right" ? "text-right" : post.align == "left" ? "text-left" : "text-center"}`}
        >
          {!isClient ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              children={post.content}
              components={{
                code: ({ node, ...props }) => {
                  const slug = `code-block-${Math.random().toString(36).substring(2, 15)}`;
                  const CodeComponent = CodeRenderer({ slug });
                  return <CodeComponent />;
                },
                h1: HeadingRenderer(1),
                h2: HeadingRenderer(2),
                h3: HeadingRenderer(3),
                h4: HeadingRenderer(4),
                h5: HeadingRenderer(5),
                h6: ComponentInterceptor(),
                // p: BSkyRenderer(post.skeets),
                p: ({ node, ...props }) => <p {...props} >{props.children}</p>,
                i: ({ node, ...props }) => <i {...props} >{props.children}</i>,
                b: ({ node, ...props }) => <b {...props} >{props.children}</b>,
                strong: ({ node, ...props }) => <strong {...props} >{props.children}</strong>,
                a: ({ node, ...props }) => <a {...props} >{props.children}</a>,
                li: ({ node, ...props }) => <li {...props} >{props.children}</li>,
                hr: ({ node, ...props }) => <>
                  <hr ref={hrWidthRef} style={{
                    // remove style
                    border: "none",
                    margin: "0",
                    height: "0",
                  }}></hr>
                  <div {...props} className={`my-4 border-t border-gray-300`} >
                    <b className="fake-hr">
                      {Array.from({ length: Math.floor(hrWidth / 10) }).map((_, i) => (
                        <React.Fragment key={i}>{borderText[i % borderText.length]}</React.Fragment>
                      ))}
                    </b>
                  </div>
                </>,
              }}
            />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              children={post.content}
              components={{
                // @ts-expect-error bad typing
                code: CodeRenderer(),
                h1: HeadingRenderer(1),
                h2: HeadingRenderer(2),
                h3: HeadingRenderer(3),
                h4: HeadingRenderer(4),
                h5: HeadingRenderer(5),
                h6: ComponentInterceptor(),
                // p: BSkyRenderer(post.skeets),
                p: ({ node, ...props }) => <p {...props} >{props.children}</p>,
                i: ({ node, ...props }) => <i {...props} >{props.children}</i>,
                b: ({ node, ...props }) => <b {...props} >{props.children}</b>,
                strong: ({ node, ...props }) => <strong {...props} >{props.children}</strong>,
                a: ({ node, ...props }) => <a {...props} >{props.children}</a>,
                li: ({ node, ...props }) => <li {...props} >{props.children}</li>,
                hr: ({ node, ...props }) => <>
                  <hr ref={hrWidthRef} style={{
                    // remove style
                    border: "none",
                    margin: "0",
                    height: "0",
                  }} />
                  <div {...props} className={`my-4 border-t border-gray-300`} >
                    <b className="fake-hr">
                      {hrWidth && Array.from({ length: Math.floor(hrWidth / 10) }).map((_, i) => (
                        <React.Fragment key={i}>{borderText[i % borderText.length]}</React.Fragment>
                      ))}
                    </b>
                  </div>
                </>,
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
