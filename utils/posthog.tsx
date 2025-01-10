import posthog from 'posthog-js'

export const initPostHog = () => {
    if (typeof window !== 'undefined') {  // Only run on client side
        posthog.init('phc_98TGVIPGeon5cKdLQmmgGYB6Mkfq63m9BDzoVxfxDW1', {
            api_host: 'https://us.i.posthog.com',
            loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing()
            }
        })
    }
}