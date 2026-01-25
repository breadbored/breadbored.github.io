import ReactMarkdown, { ExtraProps } from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Post as PostType } from "../types";
import React, {
  ClassAttributes,
  Fragment,
  HTMLAttributes,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BlueSkyEmbed from "../pages.bak/bsky-test";
import { BSkyPost } from "../utils/bsky";
import hljs from "highlight.js";
import Head from "next/head";
import remarkGfm from "remark-gfm";
import posthog from "posthog-js";

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

function NextPrev({ params, key, post }: { params: string[]; key?: Key | null; post: PostType }) {
  const [prevTitle, prevLink, nextTitle, nextLink] = params;

  return (
    <div key={key} style={{
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
      marginBottom: '2rem',
    }}>
      {prevTitle && prevLink && (
        <a
          href={prevLink}
          style={{
            flex: 1,
            padding: '1rem',
            border: '2px solid #333',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'background-color 0.2s',
          }}
          onClick={() => {
            posthog.capture('link-click', { property: prevLink })
          }}
        >
          <div style={{ fontSize: '1.5rem' }}>←</div>
          <div>{prevTitle}</div>
        </a>
      )}
      {nextTitle && nextLink && (
        <a
          href={nextLink}
          style={{
            flex: 1,
            padding: '1rem',
            border: '2px solid #333',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'background-color 0.2s',
          }}
          onClick={() => {
            posthog.capture('link-click', { property: nextLink })
          }}
        >
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div>{nextTitle}</div>
        </a>
      )}
    </div>
  )
}

function ButanoSeriesNav({ params, key, post }: { params: string[]; key?: Key | null; post: PostType }) {
  if (!post.otherInSeries) {
    return null;
  }
  // this series starts at chapter 0
  const startingChapter = 0;
  const currentChapterNum = parseInt(params[0]) || 0;
  const chapterRoute = (num: number) => {
    return `/posts/butano-series-${num}`;
  };
  const seriesMap = post.otherInSeries.sort((a, b) => {
    const aNum = parseInt(a.slug.split('butano-series-')[1]);
    const bNum = parseInt(b.slug.split('butano-series-')[1]);
    return aNum - bNum;
  });
  return (
    <ol
      key={key}
      start={0}
      className="chapter-list"
    >
      {Array.from(seriesMap).map((chapter, i) => {
        const index = i + startingChapter;
        const currentChapter = index === currentChapterNum ? true : false;

        if (currentChapter) {
          return (
            <li>
              {chapter.title} - <b>{"you are here"}</b>
            </li>
          );
        }

        return (
          <li>
            <a
              key={index}
              href={chapterRoute(index)}
            >
              {chapter.title}
            </a>
          </li>
        );
      })}
    </ol>
  )
}

function ComponentInterceptor(post: PostType) {
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
          return <NextPrev key={props.key} params={params} post={post} />;
        case "ButanoSeriesNav":
          return <ButanoSeriesNav key={props.key} params={params} post={post} />;
        default:
          break;
      }
    }

    const level = 6;
    var slug = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.history.pushState({}, "", `#${slug}`);
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
    };

    return React.createElement(
      "h" + level,
      {
        id: slug,
        className: "heading-anchor-wrapper",
        key: props.key,
        onClick: () => {
          posthog.capture('link-click', { property: `#${slug}` })
        },
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
    var slug = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.history.pushState({}, "", `#${slug}`);
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
    };

    let additionalClassName = "";
    switch (level) {
      case 1: {
        additionalClassName = "text-4xl font-bold mb-6 leading-[3.5rem]";
        break;
      }
      case 2: {
        additionalClassName = "text-3xl font-bold mb-5";
        break;
      }
      case 3: {
        additionalClassName = "text-2xl font-bold mb-4";
        break;
      }
      case 4: {
        additionalClassName = "text-xl font-bold mb-3";
        break;
      }
      case 5: {
        additionalClassName = "text-lg font-bold mb-2";
        break;
      }
    }

    return React.createElement(
      "h" + level,
      {
        id: slug,
        className: "mt-4 heading-anchor-wrapper " + additionalClassName,
        key: props.key,
        onClick: () => {
          posthog.capture('link-click', { property: `#${slug}` })
        },
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

function CodeRenderer() {
  return (
    props: ClassAttributes<HTMLPreElement | HTMLElement> &
      HTMLAttributes<HTMLPreElement | HTMLElement> &
      ExtraProps,
  ): ReactElement => {
    const codeRef = useRef<HTMLElement>(null);
    var children = React.Children.toArray(props.children);
    var text = children.reduce(flatten, "");
    var slug = text.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");

    useEffect(() => {
      if (codeRef.current && text.includes("\n")) {
        try {
          hljs.highlightElement(codeRef.current);
        } catch (e) {
          console.warn("Syntax highlighting failed:", e);
        }
      }
    }, [text]);

    if (text.includes("\n")) {
      return React.createElement(
        "pre",
        {
          id: `${slug}-pre`,
          className: "not-prose",
          key: props.key,
          onClick: () => {
            posthog.capture('code-click', { property: `${slug}-pre` })
          },
        },
        React.createElement("code", {
          id: slug,
          ref: codeRef
        }, props.children),
      );
    }
    return React.createElement(
      "span",
      {
        id: `${slug}`,
        className: "inline-code",
        key: props.key,
        style: {
          background: "#333",
          borderRadius: "5px",
          color: "orange",
          padding: "0 6px",
          margin: "0 3px",
        },
        onClick: () => {
          posthog.capture('code-click', { property: `${slug}` })
        },
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
          /^https:\/\/bsky\.app\/profile\/([^/]+)\/post\/[a-zA-Z0-9]+\/?$/gi,
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
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
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

    const timeout = setTimeout(() => {
      hrResizeListener();
    }, 100);

    return () => {
      clearTimeout(timeout);
      window?.removeEventListener("resize", hrResizeListener);
    };
  }, [])

  return (
    <>
      <Head>
        <title>{post.chapterHeader ? `${post.chapterHeader}: ${post.title}` : post.title} - bread.codes</title>
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

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://bread.codes/posts/${post.slug}`} />
        <meta property="og:title" content={post.chapterHeader ? `${post.superTitle ? `${post.superTitle}: ` : ""}${post.chapterHeader} - ${post.title}` : post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`https://bread.codes/og/${post.slug}.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bread.codes" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://bread.codes/posts/${post.slug}`} />
        <meta name="twitter:title" content={post.chapterHeader ? `${post.superTitle ? `${post.superTitle}: ` : ""}${post.chapterHeader} - ${post.title}` : post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`https://bread.codes/og/${post.slug}.png`} />
        <meta name="twitter:creator" content="@breadbored" />
      </Head>
      <article
        className={`${post.wider ? "max-w-4xl" : "max-w-2xl"} mx-auto px-4`}
        style={{
          background: "white",
        }}
      >
        {post.chapterHeader && (
          <h1 className="text-2xl font-semibold mb-2">{post.chapterHeader}</h1>
        )}
        <h1 className="text-4xl font-bold mb-4 leading-[3.5rem]">{post.title}</h1>
        <div className="mb-8 text-gray-600 pixel-font">{formattedDate}</div>
        <div
          className={`prose max-w-none ${post.align == "right" ? "text-right" : post.align == "left" ? "text-left" : "text-center"}`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={post.content}
            components={{
              code: ({ node, ...props }) => {
                const CodeComponent = CodeRenderer();
                return <CodeComponent {...props} />;
              },
              pre: ({ node, ...props }) => {
                const CodeComponent = CodeRenderer();
                return <CodeComponent {...props} />;
              },
              details: ({ node, ...props }) => {
                const elementName = node?.tagName.toLowerCase() || "span";
                if (elementName === "details") {
                  return React.createElement(
                    elementName,
                    {
                      ...props,
                      style: {
                        ...props.style,
                        border: "2px solid #000",
                        padding: "20px",
                      }
                    },
                    props.children,
                  );
                } else {
                  return React.createElement(
                    elementName,
                    { ...props },
                    props.children,
                  );
                }
              },
              h1: HeadingRenderer(1),
              h2: HeadingRenderer(2),
              h3: HeadingRenderer(3),
              h4: HeadingRenderer(4),
              h5: HeadingRenderer(5),
              h6: ComponentInterceptor(post),
              // p: BSkyRenderer(post.skeets),
              p: ({ node, ...props }) => <p {...props} >{props.children}</p>,
              i: ({ node, ...props }) => <i {...props} >{props.children}</i>,
              b: ({ node, ...props }) => <b {...props} >{props.children}</b>,
              strong: ({ node, ...props }) => <strong {...props} >{props.children}</strong>,
              a: ({ node, ...props }) => <a {...props} target="_blank" onClick={() => {
                posthog.capture('link-click', { property: props.href })
              }} >{props.children}</a>,
              li: ({ node, ...props }) => <li {...props} >{props.children}</li>,
              hr: ({ node, ...props }) => <Fragment key={props.key}>
                <hr key={`hr-${props.key}`} ref={hrWidthRef} style={{
                  // remove style
                  border: "none",
                  margin: "0",
                  height: "0",
                }} />
                <div key={`div-${props.key}`} {...props} className={`my-4 border-t border-gray-300`} >
                  <b className="fake-hr">
                    {hrWidth && Array.from({ length: Math.floor(hrWidth / 10) }).map((_, i) => (
                      <React.Fragment key={i}>{borderText[i % borderText.length]}</React.Fragment>
                    ))}
                  </b>
                </div>
              </Fragment>,
            }}
            rehypePlugins={[
              rehypeRaw,
            ]}
          />
        </div>
      </article>
    </>
  );
};

export default Post;
