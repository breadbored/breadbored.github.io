/* eslint-disable jsx-a11y/no-distracting-elements */
import Link from "next/link";
import Image from "next/image";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FULL_SCREEN_PATHS, LESS_SILLY_PATHS } from "../utils/lesssilly";

const Layout = ({ children, setAccessibilityMode, accessibilityMode }: { children: React.ReactNode, setAccessibilityMode: (val: boolean) => void, accessibilityMode: boolean }) => {
    const url_path = usePathname();
    const isFullWidth = url_path?.includes("volos-guide-to-monsters") || url_path?.includes("5e");
    const isWider = url_path?.includes("butano-series-") || url_path?.includes("/series/butano");
    const silly = !(LESS_SILLY_PATHS.includes(url_path) || LESS_SILLY_PATHS.includes(url_path + '/'));
    const fullscreen = FULL_SCREEN_PATHS.includes(url_path) || FULL_SCREEN_PATHS.includes(url_path + '/');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const url_path = window.location.pathname;
            const title = url_path === "/" ? "Home" : url_path.replaceAll("/", "").replace(/-/g, " ");
            document.title = `BreadCodes - ${title}`;
        }
    }, []);

    return fullscreen ? (
        <>{children}</>
    ) : (
        <>
            <div className={`page-width ${isFullWidth ? "full-width" : ""} ${isWider ? "wider" : ""} mx-auto mt-12`}>
                <div className="pb-12 pt-6 text-center bg-white">
                    {(silly && !accessibilityMode) && (
                        <a href="https://sendfox.com/bread" className="pb-4">
                            {/** @ts-ignore */}
                            <marquee behavior="alternate" className="pb-4">
                                subscribe
                                {/** @ts-ignore */}
                            </marquee>
                        </a>
                    )}
                    <h1 className="text-4xl font-bold mb-2 pixel-font-fancy">bread.codes</h1>
                    {!silly ? (
                        <h3 className="text-xl mb-4"><s>code</s> stuff</h3>
                    ) : (
                        <h3 className="text-xl mb-4">code stuff</h3>
                    )}

                    <nav className="space-x-4 mb-8">
                        <Link href="/" className="hover:text-blue-600 pixel-font">
                            Home
                        </Link>
                        <Link href="/series" className="hover:text-blue-600 pixel-font">
                            Series
                        </Link>
                        <Link href="/about" className="hover:text-blue-600 pixel-font">
                            About
                        </Link>
                        <Link href="/archive" className="hover:text-blue-600 pixel-font">
                            Archive
                        </Link>
                    </nav>

                    {(silly && !accessibilityMode) && (
                        <AudioPlayer
                            header="Linkin-Park-Numb.mp3"
                            src={"/assets/Linkin-Park-Numb.mp3"}
                            // autoPlayAfterSrcChange={true}
                            className="mb-4"
                            volume={0.4}
                            loop
                            // autoPlay
                            showJumpControls={false}
                        />
                    )}

                    <main className="px-4">{children}</main>

                    {!silly && (
                        <AudioPlayer
                            header="Linkin-Park-Numb.mp3"
                            src={"/assets/Linkin-Park-Numb.mp3"}
                            // autoPlayAfterSrcChange={true}
                            className="mb-4"
                            volume={0.4}
                            loop
                            // autoPlay
                            showJumpControls={false}
                        />
                    )}
                </div>
            </div>

            {silly && (
                <footer className="page-width text-center py-4 space-y-4 mx-auto" style={isFullWidth ? {
                    maxWidth: "1200px",
                    width: "100%",
                } : {
                    maxWidth: "600px",
                }}>
                    <div>
                        <Image
                            src="/assets/ie_logo.gif"
                            alt="IE Logo"
                            width={88}
                            height={31}
                            className="inline mx-1"
                        />
                        <Image
                            src="/assets/ns_logo.gif"
                            alt="Netscape Logo"
                            width={88}
                            height={31}
                            className="inline mx-1"
                        />
                        <Image
                            src="/assets/notepad.gif"
                            alt="Notepad"
                            width={88}
                            height={31}
                            className="inline mx-1"
                        />
                    </div>
                    <div>
                        <Image
                            src="/assets/pokemon3.gif"
                            alt="Pokemon"
                            width={88}
                            height={31}
                            className="inline mx-1"
                        />
                        <a href="mailto:brad@bread.codes">
                            <Image
                                src="/assets/emailme.gif"
                                alt="Email Me"
                                width={88}
                                height={31}
                                className="inline mx-1"
                            />
                        </a>
                        <Image
                            src="/assets/pokemon3.gif"
                            alt="Pokemon"
                            width={88}
                            height={31}
                            className="inline mx-1"
                        />
                    </div>
                    <div style={{
                        backgroundColor: "#f0f0f0",
                    }}>
                        <p>
                            <b>Copyright © {new Date().getFullYear()} BreadCodes</b>
                        </p>
                    </div>
                </footer>
            )}
        </>
    );
};

export default Layout;
