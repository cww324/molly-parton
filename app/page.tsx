import Image from "next/image";
import EmailSignupForm from "@/components/email-signup-form";

const artPreviews = [
  {
    src: "/art/firstmollyparton.png",
    alt: "Molly Parton concept art 01",
  },
  {
    src: "/art/2ndmollyparton.png",
    alt: "Molly Parton concept art 02",
  },
  {
    src: "/art/2026-01-16_16-29-28_9243.png",
    alt: "Molly Parton studio preview 03",
  },
  {
    src: "/art/2026-01-16_16-31-13_2594.png",
    alt: "Molly Parton studio preview 04",
  },
  {
    src: "/art/2026-01-16_16-32-38_5415.png",
    alt: "Molly Parton studio preview 05",
  },
  {
    src: "/art/2026-01-16_16-34-37_3251.png",
    alt: "Molly Parton studio preview 06",
  },
];

export default function HomePage() {
  return (
    <main className="grain mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-10 lg:px-10">
      <nav className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/70">
        <div className="font-display text-2xl text-black">Molly Parton</div>
        <div className="hidden gap-8 md:flex">
          <span>Drop 01</span>
          <span>Studio</span>
          <span>Coming soon</span>
        </div>
        <div className="rounded-full border border-black/30 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-black/70">
          Drop launching soon
        </div>
      </nav>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <div className="sticker inline-flex w-fit items-center gap-3 rounded-full border border-black/30 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em]">
            Festivalwear for the feral
          </div>
          <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-wide md:text-7xl">
            Drop launching soon.
          </h1>
          <p className="max-w-xl text-base text-black/70">
            Molly Parton is a festival-inspired capsule built for self-expression
            and sunrise stories. The first release is in motion. The studio is
            refining the art and the fits now.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-black/60">
            <span className="rounded-full border border-black/20 px-3 py-1">
              Limited run
            </span>
            <span className="rounded-full border border-black/20 px-3 py-1">
              Original art
            </span>
            <span className="rounded-full border border-black/20 px-3 py-1">
              Drop 01 in progress
            </span>
          </div>
          <a
            href="#preview"
            className="w-fit rounded-full border border-black/30 px-6 py-3 text-xs uppercase tracking-[0.3em] transition hover:border-black/70"
          >
            View studio previews
          </a>
        </div>

        <div className="hero-orbit relative overflow-hidden rounded-[36px] border border-black/20 p-8 text-white shadow-2xl">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/20 bg-white/10 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Molly Parton / Drop 01
            </p>
            <h2 className="font-display text-4xl uppercase">
              DROP LAUNCHING SOON
            </h2>
            <p className="text-sm text-white/70">
              We are building a small, loud, unforgettable first capsule. Check
              back soon for the full drop.
            </p>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <div className="text-xs uppercase tracking-[0.25em] text-white/60">
                Studio heat
              </div>
              <div className="mt-4 h-44 rounded-2xl border border-white/20 bg-[linear-gradient(135deg,#f04e2b_0%,#f7efe3_45%,#85a07a_100%)]" />
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
              <span>Site live</span>
              <span>Drop countdown soon</span>
            </div>
          </div>
        </div>
      </section>

      <section id="preview" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/60">
              Studio previews
            </p>
            <h2 className="font-display text-4xl uppercase">
              Art in progress
            </h2>
          </div>
          <p className="max-w-sm text-sm text-black/60">
            Raw sketches, glow tests, and mood boards from the studio while the
            final pieces are being cut.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {artPreviews.map((art) => (
            <div
              key={art.src}
              className="group overflow-hidden rounded-[28px] border border-black/10 bg-white/70 p-4 shadow-sm"
            >
              <div className="relative h-60 w-full overflow-hidden rounded-2xl">
                <Image
                  src={art.src}
                  alt={art.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="(min-width: 1024px) 420px, (min-width: 768px) 45vw, 90vw"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-[32px] border border-black/10 bg-white/70 p-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60">
            What to expect
          </p>
          <h3 className="font-display text-3xl uppercase">
            A small, loud first drop
          </h3>
          <p className="text-sm text-black/70">
            The first release is intentionally tight. We are refining the fit,
            dialing in print tests, and locking the story. Every piece is built
            to feel like a memory.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-black/60">
            <span className="rounded-full border border-black/20 px-3 py-1">
              Limited quantity
            </span>
            <span className="rounded-full border border-black/20 px-3 py-1">
              Handmade energy
            </span>
            <span className="rounded-full border border-black/20 px-3 py-1">
              Story-driven
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-dune/80 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-black/60">
            Stay close
          </div>
          <p className="text-sm text-black/70">
            Follow the glow and check back for the launch. We will open the drop
            the moment the art is sealed.
          </p>
          <EmailSignupForm />
          <div className="mt-auto rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-xs uppercase tracking-[0.3em]">
            Drop launching soon
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-3 pb-10 text-xs uppercase tracking-[0.3em] text-black/50">
        <span>Built for the wild-hearted</span>
        <span>See you in the glow</span>
      </footer>
    </main>
  );
}
