import { AppProps } from "next/app";
import Layout from "../layouts/Layout";
import Script from "next/script";
import { useEffect, useState } from "react";
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
  const silly = !LESS_SILLY_PATHS.includes(pathname);
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);

  useEffect(() => {
    initPostHog();
    if (silly) {
      document.body.classList.add("not-silly");
    } else {
      document.body.classList.remove("not-silly");
    }
  }, []);

  useEffect(() => {
    initPostHog();
    if (accessibilityMode) {
      document.body.classList.add("accessibility-mode");
    } else {
      document.body.classList.remove("accessibility-mode");
    }
  }, [accessibilityMode]);

  return (
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

      <a
        tabIndex={1}
        title="Accessibility Mode Toggle Icon"
        onClick={() => {
          setAccessibilityMode(!accessibilityMode);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setAccessibilityMode(!accessibilityMode);
          }
        }}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          cursor: "pointer",
        }}
      >
        <img
          src="/assets/accessibility_icon.png"
          alt="Accessibility Mode Toggle Icon"
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto",
            padding: "2px",
            borderRadius: "8px",
            border: "2px solid white",
            backgroundColor: "white"
          }}
          onClick={() => {
            setAccessibilityMode(!accessibilityMode);
          }}
        />
      </a>

      <Layout accessibilityMode={accessibilityMode} setAccessibilityMode={(val: boolean) => {
        setAccessibilityMode(val);
      }}>
        <Component {...pageProps} />
      </Layout>
      <PostHogPageView />
    </>
  );
}

export default MyApp;
