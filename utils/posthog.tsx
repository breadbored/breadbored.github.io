import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window !== "undefined") {
    // Only run on client side
    posthog.init("phc_98TGVIPGeon5cKdLQmmgGYB6Mkfq63m9BDzoVxfxDW1", {
      api_host: "https://us.i.posthog.com",
      loaded: (posthog) => {
        posthog.opt_out_capturing();
      },
      persistence: "memory",
      persistence_name: "posthog",
      // Disable page view tracking because Next acts like a single-page app once loaded
      // and we need to handle this ourselves
      // https://posthog.com/tutorials/single-page-app-pageviews
      capture_pageview: false,
    });
  }
};
