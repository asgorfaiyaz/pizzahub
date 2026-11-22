"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf8f5",
          color: "#3a322e",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: 24,
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: 460,
            padding: 32,
            border: "1px solid #e7e0d6",
            borderRadius: 16,
            background: "#ffffff",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b6158" }}>
            {error.message ||
              "The application hit an unexpected error. Please try again."}
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 8,
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={retry}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#a53b23",
                color: "#fff",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #e7e0d6",
                color: "#3a322e",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
