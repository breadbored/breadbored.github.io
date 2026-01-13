import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const AlbumStatus = () => {
  const router = useRouter();
  const { uuid } = router.query;
  const [status, setStatus] = useState<"processing" | "ready" | "error">("processing");
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState("");

  const apiUrl = process.env.NODE_ENV === "production"
    ? "https://album.bread.codes"
    : "http://localhost:3000";

  useEffect(() => {
    if (!uuid) return;

    // Animated dots for processing message
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Poll the ready endpoint every minute
    const pollInterval = setInterval(async () => {
      try {
        // Determine API endpoint based on environment
        const apiUrl = process.env.NODE_ENV === "production"
          ? `https://album.bread.codes/ready/${uuid}`
          : `http://localhost:3000/ready/${uuid}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
          // The API returns the link as plain text
          const link = await response.text();
          setDownloadLink(link);
          setStatus("ready");
          clearInterval(pollInterval);
          clearInterval(dotsInterval);
        } else if (response.status === 404 || response.status === 202) {
          // Still processing
          setStatus("processing");
        } else {
          // Error occurred
          setError("An error occurred while checking the upload status");
          setStatus("error");
          clearInterval(pollInterval);
          clearInterval(dotsInterval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        // Keep polling on network errors
      }
    }, 60000); // Poll every minute

    // Check immediately on mount
    const checkStatus = async () => {
      try {
        const apiUrl = process.env.NODE_ENV === "production"
          ? `https://album.bread.codes/ready/${uuid}`
          : `http://localhost:3000/ready/${uuid}`;

        const response = await fetch(apiUrl);

        if (response.ok) {
          const link = await response.text();
          setDownloadLink(link);
          setStatus("ready");
          clearInterval(pollInterval);
          clearInterval(dotsInterval);
        }
      } catch (err) {
        console.error("Initial check error:", err);
      }
    };

    checkStatus();

    return () => {
      clearInterval(pollInterval);
      clearInterval(dotsInterval);
    };
  }, [uuid]);

  return (
    <div>
      <Head>
        <title>Album Status - bread.codes</title>
      </Head>
      <div style={{
        backgroundColor: "#f0f0f0",
        padding: "20px",
        border: "3px solid #000",
        minHeight: "400px",
      }}>
        <center>
          <h1 style={{
            fontFamily: "Comic Sans MS, cursive",
            color: "#ff0066",
            textShadow: "2px 2px #000",
            fontSize: "32px",
            marginBottom: "20px"
          }}>
            .:*~*:. ALBUM STATUS .:*~*:.
          </h1>

          {status === "processing" && (
            <div style={{
              backgroundColor: "#ffffcc",
              border: "3px solid #ff9900",
              padding: "30px",
              marginTop: "20px",
              fontFamily: "Arial, sans-serif",
            }}>
              <img
                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                alt="Loading"
                style={{ width: "32px", height: "32px", marginBottom: "10px" }}
              />
              <h2 style={{
                fontSize: "24px",
                color: "#ff6600",
                marginBottom: "10px",
                fontWeight: "bold"
              }}>
                PROCESSING YOUR ALBUM{dots}
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "15px" }}>
                Your upload is being processed! This may take a few minutes.
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666",
                backgroundColor: "#ffffff",
                padding: "10px",
                border: "2px dashed #999",
                marginTop: "20px"
              }}>
                <b>Upload ID:</b> {uuid}
                <br />
                <br />
                I'm checking every minute for your ROM. Keep this page open!
              </p>
              <div style={{ marginTop: "20px" }}>
                {/* @ts-expect-error: Marquee for retro effect */}
                <marquee behavior="scroll" width="300">
                  <b>Please wait while I generate your ROM...</b>
                  {/* @ts-expect-error: Marquee for retro effect */}
                </marquee>
              </div>
            </div>
          )}

          {status === "ready" && downloadLink && (
            <div style={{
              backgroundColor: "#ccffcc",
              border: "3px solid #00cc00",
              padding: "30px",
              marginTop: "20px",
              fontFamily: "Arial, sans-serif",
            }}>
              <h2 style={{
                fontSize: "28px",
                color: "#008800",
                marginBottom: "15px",
                fontWeight: "bold"
              }}>
                ✓ YOUR ROM IS READY!
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                Your album has been successfully processed!
              </p>
              <a
                href={`${apiUrl}${downloadLink}`}
                style={{
                  display: "inline-block",
                  padding: "15px 40px",
                  backgroundColor: "#ff6600",
                  border: "3px outset #cc5500",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontFamily: "Comic Sans MS, cursive",
                  fontSize: "18px",
                  fontWeight: "bold",
                  textShadow: "1px 1px #000",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
              >
                {">>> DOWNLOAD ROM <<<"}
              </a>
              <div style={{
                marginTop: "30px",
                fontSize: "12px",
                color: "#666",
                backgroundColor: "#ffffff",
                padding: "10px",
                border: "2px dashed #999"
              }}>
                <b>Upload ID:</b> {uuid}
              </div>
            </div>
          )}

          {status === "error" && (
            <div style={{
              backgroundColor: "#ffcccc",
              border: "3px solid #ff0000",
              padding: "30px",
              marginTop: "20px",
              fontFamily: "Arial, sans-serif",
            }}>
              <h2 style={{
                fontSize: "24px",
                color: "#cc0000",
                marginBottom: "15px",
                fontWeight: "bold"
              }}>
                ✗ ERROR
              </h2>
              <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                {error || "Something went wrong while processing your upload."}
              </p>
              <button
                onClick={() => router.push("/album")}
                style={{
                  padding: "10px 30px",
                  backgroundColor: "#6666ff",
                  border: "3px outset #4444cc",
                  color: "#ffffff",
                  fontFamily: "Comic Sans MS, cursive",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "20px"
                }}
              >
                &lt;&lt; TRY AGAIN
              </button>
            </div>
          )}

          <div style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#e0e0ff",
            border: "2px solid #0000cc",
            fontFamily: "Arial, sans-serif",
            fontSize: "13px"
          }}>
            <b>What's happening?</b>
            <br />
            <br />
            I'm converting your tracker music files into a Game Boy Advance ROM!
            <br />
            This process usually takes a few minutes.
          </div>
        </center>
      </div>
    </div>
  );
};

export default AlbumStatus;
