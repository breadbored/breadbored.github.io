import { GetStaticProps } from 'next';
import Icon from '../components/Icon';
import { dateFormat, timeFormat } from '../utils/dateTimeFormat';
import { Link } from 'react-router-dom';
import {
    AtpAgent,
    AtpSessionEvent,
    AtpSessionData,
    BskyAgent,
} from "@atproto/api"
import { BSkyPost } from '../utils/bsky';
import ReactMarkdown, { ExtraProps } from "react-markdown";

export interface BskySession {
    /** Encoded auth token for making requests */
    accessJwt: string
    /** Encoded auth token for refreshing credentials */
    refreshJwt: string
    /** The registered handle of the authenticated account (e.g. jay.bsky.social) */
    handle: string
    /** The DID of the authenticated account (e.g. did:plc:abc123) */
    did: string
    /** The registered email of the authenticated account */
    email?: string
    /** If email is confirmed */
    emailConfirmed?: boolean
}

export interface RefreshResponse {
    accessJwt: string
    refreshJwt: string
    handle: string
    did: string
}

export interface LoginResponse {
    success: boolean
    data: BskySession
}

// Add these if you need to work with BlueSky's user profiles
export interface ProfileViewBasic {
    did: string
    handle: string
    displayName?: string
    avatar?: string
    viewer?: ViewerState
    labels?: Label[]
}

export interface ViewerState {
    muted?: boolean
    blockedBy?: boolean
    blocking?: string
    following?: string
    followedBy?: string
}

export interface Label {
    src: string
    uri: string
    val: string
    cts: string
    neg?: boolean
}


interface ParsedBskyUrl {
    handle: string
    rkey: string
}

interface PageProps {
    post: {
        message: string
        data: BSkyPost | null
        lastUpdated: string
    }
}

let sessionData: BskySession | null = null
async function initializeBskySession(agent: BskyAgent): Promise<{ accessJwt: string; refreshJwt: string; handle: string; did: string; }> {
    try {
        const response = await agent.login({
            identifier: process.env.BSKY_IDENTIFIER!,
            password: process.env.BSKY_APP_PASSWORD!,
        })

        console.log("Successfully authenticated with BlueSky")

        return {
            accessJwt: response.data.accessJwt,
            refreshJwt: response.data.refreshJwt,
            handle: response.data.handle,
            did: response.data.did,
        }
    } catch (error) {
        console.error("Failed to authenticate with BlueSky:", error)
        throw error
    }
}

const parseBskyUrl = (url: string): ParsedBskyUrl => {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')

    if (pathParts[1] !== 'profile' || pathParts[3] !== 'post') {
        throw new Error('Invalid BlueSky post URL format')
    }

    return {
        handle: pathParts[2],
        rkey: pathParts[4],
    }
}

export const isBlueSkyLink = (url: string) => {
    return url.includes("bsky.app") && url.match(/^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/);
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
    try {
        // Initialize BlueSky agent
        const agent = new BskyAgent({
            service: 'https://bsky.social'
        })
        // You'll need to login here if required
        const session = await initializeBskySession(agent)

        const url = 'https://bsky.app/profile/bread.codes/post/3lawo3zmggc2a'

        if (
            !url.match(
                /^https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/[a-zA-Z0-9]+\/?$/
            )
        ) {
            throw new Error('Invalid BlueSky post URL format')
        }

        // Parse the URL to get handle and rkey
        const { handle, rkey } = parseBskyUrl(url)

        // Get DID from handle
        const profile = await agent.getProfile({ actor: handle })
        const did = profile.data.did

        // Get the post using DID and rkey
        const post = await agent.getPost({
            repo: did,
            rkey: rkey,
        })

        // Format the response
        const postData = {
            uri: post.uri,
            text: post.value.text,
            author: {
                did: profile.data.did,
                handle: profile.data.handle,
                displayName: profile.data.displayName,
                avatar: profile.data.avatar,
            },
            createdAt: post.value.createdAt,
            embed: null,
            indexedAt: typeof post.value.indexedAt === 'string' ? post.value.indexedAt : null,
        }

        return {
            props: {
                post: {
                    message: 'Post fetched successfully',
                    data: postData,
                    lastUpdated: new Date().toISOString(),
                }
            }
        }
    } catch (error) {
        // In getStaticProps, we should return a proper error prop
        // instead of using an error handler middleware
        return {
            props: {
                post: {
                    message: 'Failed to fetch post',
                    data: null,
                    lastUpdated: new Date().toISOString(),
                }
            }
        }
    }
}

const BlueSkyEmbed = ({
    post: skeet,
}: PageProps) => {
    const postedDate = skeet.data ? new Date(skeet.data.createdAt) : new Date(0);
    const userLink = `https://bsky.app/profile/${skeet.data?.author.displayName}.${skeet.data?.author.handle}`;
    return (
        <>
            {skeet && skeet.data && (
                <div key={skeet.data.uri} className="bsky">
                    <div className="bsky-header">
                        <div className="bsky-avatar">
                            <img src={skeet.data.author.avatar} alt="avatar" className="profile-image-m" />
                        </div>
                        <div className="bsky-author">
                            <a href={userLink} className="bsky-author-link" target='_blank'>
                                <span className="bsky-author-display-name">{skeet.data.author.displayName}</span>
                                <br />
                                <span className="bsky-author-handle">{skeet.data.author.handle}</span>
                            </a>
                        </div>
                    </div>
                    <div className="bsky-content">
                        <p className="bsky-text" style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                            {skeet.data.text}
                        </p>
                        <div className="bsky-images">
                            {skeet.data.embed && skeet.data.embed.images && skeet.data.embed.images.map((image, index) => {
                                return (
                                    <img
                                        key={`bsky-image-${index}`}
                                        src={image.image_url}
                                        alt={image.alt}
                                        className="bsky-image"
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className="bsky-footer">
                        <div className="bsky-date">{dateFormat(postedDate)} {timeFormat(postedDate)}</div>
                        <div className="bsky-icon">
                            {/* <a href={skeet.data.uri} target='_blank'> */}
                            <Icon
                                name="blue-sky"
                                extra_classes="no-invert"
                                alt_text={"Blue Sky Logo"}
                                icon_size={20}
                            />
                            {/* </a> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BlueSkyEmbed;