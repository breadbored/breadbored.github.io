import {
    AtpAgent,
    AtpSessionEvent,
    AtpSessionData,
    BskyAgent,
    BlobRef,
} from "@atproto/api"

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


export interface ParsedBskyUrl {
    handle: string
    rkey: string
}

export type BSkyPost = {
    url?: string
    uri: string
    text: string
    author: {
        did: string
        handle: string
        displayName?: string
        avatar?: string
    }
    createdAt: string
    embed: {
        $type: string
        images: {
            alt: string
            aspectRatio: {
                width: number
                height: number
            }
            image?: string
            image_url?: string
        }[]
    } | null
    indexedAt: string | null
} | null

export interface BSkyPostData {
    message: string
    data: BSkyPost
    lastUpdated: string
}

export interface PageProps {
    post: BSkyPostData
}

export async function initializeBskySession(agent: BskyAgent): Promise<{ accessJwt: string; refreshJwt: string; handle: string; did: string; }> {
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

export const parseBskyUrl = (url: string): ParsedBskyUrl => {
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

export function getBskyImageUrl(did: string, blobRef: BlobRef): string {
    // Get the CID string from the ref
    const cid = blobRef.ref.toString()

    // Construct the CDN URL
    // https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:mkvb2iguo4rjzi4guolw7bbt/bafkreicjmram6sngesenoarkaa7o36vmmdp2yl65yf3abhpjwcov34yzpu@jpeg
    return `https://cdn.bsky.app/img/feed_fullsize/plain/${did}/${cid}@jpeg`
}

export { BskyAgent }