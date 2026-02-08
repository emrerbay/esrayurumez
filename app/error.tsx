"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="font-heading text-2xl font-bold text-text-main mb-2">Bir hata oluştu</h1>
      <p className="text-text-main/80 mb-6 text-center max-w-md">
        Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-text-main font-medium hover:bg-bg-accent"
        >
          Anasayfaya dön
        </Link>
      </div>
    </div>
  );
}
