import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="font-heading text-3xl font-bold text-text-main mb-2">404</h1>
      <p className="text-text-main/80 mb-6">Bu sayfa bulunamadı.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
      >
        Anasayfaya dön
      </Link>
    </div>
  );
}
