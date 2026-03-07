"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "32rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Bir hata oluştu</h1>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              background: "#1c8d8a",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Tekrar dene
          </button>
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              color: "#333",
              textDecoration: "none",
            }}
          >
            Anasayfaya dön
          </a>
        </div>
      </body>
    </html>
  );
}
