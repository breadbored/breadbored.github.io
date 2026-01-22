import { AppProps } from "next/app";
import Layout from "../layouts/Layout";
import Script from "next/script";
import { useEffect, useState, useRef } from "react";
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
import { getAccessibilitySettings, setAccessibilitySettings } from "../utils/accessibilityCookies";

hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("javascript", javascript);

function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const silly = !LESS_SILLY_PATHS.includes(pathname);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [readableFonts, setReadableFonts] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [hasShownInitialTooltip, setHasShownInitialTooltip] = useState<boolean>(false);

  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const mainButtonRef = useRef<HTMLButtonElement>(null);

  const accessibilityMode = highContrast || readableFonts || reducedMotion;

  useEffect(() => {
    initPostHog();
    if (silly) {
      document.body.classList.add("not-silly");
    } else {
      document.body.classList.remove("not-silly");
    }

    // Load accessibility settings from cookie on mount
    const savedSettings = getAccessibilitySettings();
    setHighContrast(savedSettings.highContrast);
    setReadableFonts(savedSettings.readableFonts);
    setReducedMotion(savedSettings.reducedMotion);
  }, []);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast-mode");
    } else {
      document.body.classList.remove("high-contrast-mode");
    }
  }, [highContrast]);

  useEffect(() => {
    if (readableFonts) {
      document.body.classList.add("readable-fonts-mode");
    } else {
      document.body.classList.remove("readable-fonts-mode");
    }
  }, [readableFonts]);

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add("reduced-motion-mode");
    } else {
      document.body.classList.remove("reduced-motion-mode");
    }
  }, [reducedMotion]);

  // Save accessibility settings to cookie whenever they change
  useEffect(() => {
    setAccessibilitySettings({
      highContrast,
      readableFonts,
      reducedMotion,
    });
  }, [highContrast, readableFonts, reducedMotion]);

  // Focus management: when tooltip opens, focus first option
  useEffect(() => {
    if (showTooltip && hasShownInitialTooltip) {
      // Only auto-focus if user manually opened it (not on initial load)
      firstOptionRef.current?.focus();
    }
  }, [showTooltip, hasShownInitialTooltip]);

  return (
    <>
      <Script
        id="posthog-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init('phc_pdmoQwXOuMwrydF7gjWZ715ePcUR5JnArf63eC8uMNq',{api_host:'https://us.i.posthog.com'})
          `,
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
        }}
      >
        {showTooltip && (
          <div
            id="accessibility-menu"
            role="menu"
            aria-label="Accessibility options"
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
              visibility: showTooltip ? "visible" : "hidden",
              lineHeight: "1.4",
              fontSize: "1.5rem",
              marginBottom: "10px",
            }}
          >
            <ul
              style={{
                margin: "4px 0 0 0",
                listStyle: "none",
                padding: 0,
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <button
                  ref={firstOptionRef}
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowTooltip(false);
                      mainButtonRef.current?.focus();
                    }
                  }}
                  aria-pressed={highContrast}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px 0",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "inherit",
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    border: "2px solid black",
                    backgroundColor: highContrast ? "black" : "white",
                    flexShrink: 0,
                  }}></span>
                  High Contrast Colors
                </button>
              </li>
              <li style={{ marginBottom: "8px" }}>
                <button
                  type="button"
                  onClick={() => setReadableFonts(!readableFonts)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowTooltip(false);
                      mainButtonRef.current?.focus();
                    }
                  }}
                  aria-pressed={readableFonts}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px 0",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "inherit",
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    border: "2px solid black",
                    backgroundColor: readableFonts ? "black" : "white",
                    flexShrink: 0,
                  }}></span>
                  Readable Fonts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowTooltip(false);
                      mainButtonRef.current?.focus();
                    }
                  }}
                  aria-pressed={reducedMotion}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "4px 0",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "inherit",
                  }}
                >
                  <span style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    border: "2px solid black",
                    backgroundColor: reducedMotion ? "black" : "white",
                    flexShrink: 0,
                  }}></span>
                  Reduced Motion
                </button>
              </li>
            </ul>
          </div>
        )}
        <button
          ref={mainButtonRef}
          type="button"
          aria-label="Toggle accessibility options"
          aria-expanded={showTooltip}
          aria-controls="accessibility-menu"
          title="Accessibility options"
          onClick={() => {
            setShowTooltip(!showTooltip);
            setHasShownInitialTooltip(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && showTooltip) {
              setShowTooltip(false);
            }
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

      <Layout
        accessibilityMode={accessibilityMode}
        setAccessibilityMode={(val: boolean) => {
          // Toggle all features on/off together
          setHighContrast(val);
          setReadableFonts(val);
          setReducedMotion(val);
        }}
      >
        <Component {...pageProps} />
      </Layout>
      <PostHogPageView />
    </>
  );
}

export default MyApp;
