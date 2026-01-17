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
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [hasShownInitialTooltip, setHasShownInitialTooltip] = useState<boolean>(false);

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

  // Show tooltip on initial load for 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => {
        setShowTooltip(false);
        setHasShownInitialTooltip(true);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        onMouseEnter={() => hasShownInitialTooltip && setShowTooltip(true)}
        onMouseLeave={() => hasShownInitialTooltip && setShowTooltip(false)}
      >
        <div
          className="accessibility-tooltip"
          style={{
            backgroundColor: "white",
            border: "2px solid black",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "300px",
            transform: showTooltip ? "translateX(0)" : "translateX(calc(100% + 20px))",
            opacity: showTooltip ? 1 : 0,
            transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            pointerEvents: showTooltip ? "auto" : "none",
            // fontSize: "14px",
            lineHeight: "1.4",
            fontSize: "1.5rem",
            marginBottom: "10px",
          }}
        >
          <ul
            style={{
              margin: "4px 0 0 0",
            }}
          >
            <li>High Contrast Colors</li>
            <li>Readable Fonts</li>
            <li>Reduced Motion</li>
          </ul>
        </div>
        <button
          type="button"
          aria-label={accessibilityMode ? "Disable accessibility mode" : "Enable accessibility mode"}
          aria-pressed={accessibilityMode}
          title={accessibilityMode ? "Disable accessibility mode" : "Enable accessibility mode"}
          onClick={() => {
            setAccessibilityMode(!accessibilityMode);
          }}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/accessibility_icon.png"
            alt=""
            aria-hidden="true"
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto",
              padding: "2px",
              borderRadius: "8px",
              border: "2px solid white",
              backgroundColor: "white"
            }}
          />
        </button>
      </div>

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
