import { AppProps } from "next/app";
import Layout from "../layouts/Layout";
import Script from "next/script";
import { useEffect } from "react";
import { initPostHog } from "../utils/posthog";
import hljs from "highlight.js";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import javascript from "highlight.js/lib/languages/javascript";
import "../styles/App.scss";
import "tailwindcss/tailwind.css";
import '../styles/dracula.css';
import { Head } from "next/document";
import PostHogPageView from "../components/PostHogPageView";
import { usePathname } from "next/navigation";
import { LESS_SILLY_PATHS } from "../utils/lesssilly";

hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("javascript", javascript);

function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const less_silly = !LESS_SILLY_PATHS.includes(pathname);

  useEffect(() => {
    if (less_silly) {
      initPostHog();
      document.body.classList.add("not-silly");
    }
  }, []);

  return !less_silly ? (
    <>
      <Script
        id="posthog-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_98TGVIPGeon5cKdLQmmgGYB6Mkfq63m9BDzoVxfxDW1',{api_host:'https://us.i.posthog.com'})
          `,
        }}
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <PostHogPageView />
    </>
  ) : <Component {...pageProps} />;
}

export default MyApp;
