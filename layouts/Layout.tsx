/* eslint-disable jsx-a11y/no-distracting-elements */
import Link from "next/link";
import Image from "next/image";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="page-width mx-auto mt-12">
                <div className="pb-12 pt-6 text-center bg-white">
                    {/** @ts-ignore */}
                    <marquee className="my-4" behavior="alternate">
                        HTML Is My Passion
                        {/** @ts-ignore */}
                    </marquee>
                    <h1 className="text-4xl font-bold mb-2">bread.codes</h1>
                    <h3 className="text-xl mb-4">code stuff</h3>

                    <nav className="space-x-4 mb-8">
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/search" className="hover:text-blue-600">
                            Search
                        </Link>
                        <Link href="/about" className="hover:text-blue-600">
                            About
                        </Link>
                        <Link href="/archive" className="hover:text-blue-600">
                            Archive
                        </Link>
                    </nav>

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

                    <main className="px-4">{children}</main>
                </div>
            </div>

            <footer className="page-width text-center py-4 space-y-4 mx-auto">
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
        </>
    );
};

export default Layout;
