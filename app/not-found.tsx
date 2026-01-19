import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-black/60">
        Page not found
      </p>
      <h1 className="font-display text-4xl uppercase">
        That drop is out of reach
      </h1>
      <Link
        href="/"
        className="rounded-full border border-black/30 px-6 py-3 text-xs uppercase tracking-[0.3em] transition hover:border-black/70"
      >
        Return home
      </Link>
    </main>
  );
}
