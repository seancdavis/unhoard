import { useAuth } from "../lib/auth";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.5 1.1 7.5 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.5 1.1 7.5 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c4.9 0 9.4-1.9 12.8-5l-5.9-5c-1.9 1.4-4.3 2.2-6.9 2.2-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.1 16.3 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4h0l5.9 5c-.4.4 6.5-4.7 6.5-14.4 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

export default function Landing() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating decorative marks */}
      <div
        aria-hidden="true"
        className="absolute top-16 left-[8%] text-6xl float-soft select-none"
        style={{ color: "var(--color-sun-deep)", animationDelay: "0.2s" }}
      >
        ✦
      </div>
      <div
        aria-hidden="true"
        className="absolute top-[30%] right-[10%] text-7xl float-soft select-none"
        style={{ color: "var(--color-sea)", animationDelay: "1.4s" }}
      >
        ❋
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-[18%] left-[14%] text-5xl float-soft select-none"
        style={{ color: "var(--color-tomato)", animationDelay: "0.9s" }}
      >
        ✺
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-[10%] right-[18%] text-6xl float-soft select-none"
        style={{ color: "var(--color-plum)", animationDelay: "2.1s" }}
      >
        ✧
      </div>

      <header className="relative z-10 px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl grid place-items-center"
            style={{
              background: "var(--color-tomato)",
              border: "1.5px solid var(--color-ink)",
              boxShadow: "2px 2px 0 var(--color-ink)",
            }}
          >
            <span className="font-display text-xl text-paper font-bold">u.</span>
          </div>
          <span className="font-display text-xl font-semibold">Unhoard</span>
        </div>
      </header>

      <main className="relative z-10 px-6 md:px-12 pt-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full"
            style={{
              background: "var(--color-paper-deep)",
              border: "1.5px solid var(--color-ink)",
            }}
          >
            <span className="text-sm font-medium text-ink-soft italic font-display">
              for the enthusiastically obsessed
            </span>
          </div>

          <h1 className="font-display leading-[0.95] tracking-tight text-6xl md:text-8xl font-bold">
            A little home<br />
            for the things<br />
            <span
              className="inline-block italic"
              style={{
                color: "var(--color-tomato)",
                fontVariationSettings: '"SOFT" 100, "WONK" 1',
                transform: "rotate(-1.5deg)",
              }}
            >
              you love too much.
            </span>
          </h1>

          <svg
            className="squiggle mt-8 max-w-md"
            viewBox="0 0 400 14"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 7 Q 20 0 40 7 T 80 7 T 120 7 T 160 7 T 200 7 T 240 7 T 280 7 T 320 7 T 360 7 T 400 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <p className="mt-8 text-lg md:text-2xl max-w-2xl leading-relaxed text-ink-soft">
            Sneakers. Vinyl. LEGO sets. Hot sauces. Whatever it is you collect a
            little <em className="not-italic font-semibold text-ink">too much</em> of — Unhoard is the
            soft-landing place to catalog it. No judgement. A little glitter.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-lg transition-transform"
              style={{
                background: "var(--color-ink)",
                color: "var(--color-paper)",
                border: "1.5px solid var(--color-ink)",
                boxShadow: "4px 4px 0 var(--color-tomato)",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "translate(2px, 2px)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <span
                className="w-7 h-7 rounded-full bg-paper grid place-items-center"
                style={{ border: "1.5px solid var(--color-paper)" }}
              >
                <GoogleMark />
              </span>
              Continue with Google
            </button>
            <span className="text-sm text-ink-soft italic font-display">
              …that's all you need. no form, no shame.
            </span>
          </div>

          {/* Three playful cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              rotate="-2deg"
              accent="var(--color-tomato)"
              emoji="📚"
              title="Make collections"
              body="Vinyl? Ceramics? Novelty hot sauces? Start a shelf for every obsession."
            />
            <FeatureCard
              rotate="1.5deg"
              accent="var(--color-sea)"
              emoji="📸"
              title="Snap and stash"
              body="Every piece gets a photo, notes, and as many tags as your heart demands."
            />
            <FeatureCard
              rotate="-1deg"
              accent="var(--color-sun-deep)"
              emoji="🔖"
              title="Filter by mood"
              body="Tap any tag to zoom in on the ones that scratch the exact right itch."
            />
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 md:px-12 pb-10 text-sm text-ink-soft">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-dashed"
          style={{ borderColor: "rgba(42,24,16,0.25)" }}
        >
          <span>Made with warmth on Netlify.</span>
          <span className="font-display italic">no hoarding, just collecting ✦</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  rotate,
  accent,
  emoji,
  title,
  body,
}: {
  rotate: string;
  accent: string;
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div
      className="zine-card p-6 relative"
      style={{ transform: `rotate(${rotate})` }}
    >
      <div
        className="absolute -top-4 left-6 px-3 py-1 rounded-full text-xs font-bold tracking-wide text-paper uppercase"
        style={{
          background: accent,
          border: "1.5px solid var(--color-ink)",
          boxShadow: "2px 2px 0 var(--color-ink)",
        }}
      >
        new
      </div>
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="font-display text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
