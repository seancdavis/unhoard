import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDisplayName, getInitial, useAuth } from "../lib/auth";
import { colorCircleFor } from "../lib/placeholder";

export default function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const identityKey = user?.email || user?.id || "x";
  const circleColor = colorCircleFor(identityKey);
  const name = getDisplayName(user);
  const initial = getInitial(user);

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md"
      style={{
        background: "rgba(251, 244, 231, 0.85)",
        borderBottom: "1.5px solid var(--color-ink)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-2xl grid place-items-center transition-transform group-hover:rotate-6"
            style={{
              background: "var(--color-tomato)",
              border: "1.5px solid var(--color-ink)",
              boxShadow: "2px 2px 0 var(--color-ink)",
            }}
          >
            <span className="font-display text-lg text-paper font-bold">u.</span>
          </div>
          <span className="font-display text-xl font-semibold">Unhoard</span>
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Open account menu"
            aria-expanded={open}
            className="w-11 h-11 rounded-full grid place-items-center font-display font-bold text-lg transition-transform hover:scale-105"
            style={{
              background: circleColor,
              color: "var(--color-paper)",
              border: "1.5px solid var(--color-ink)",
              boxShadow: "2px 2px 0 var(--color-ink)",
            }}
          >
            {initial}
          </button>

          {open && (
            <div
              className="absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden wobble-in"
              style={{
                background: "var(--color-paper)",
                border: "1.5px solid var(--color-ink)",
                boxShadow: "4px 4px 0 var(--color-ink)",
              }}
            >
              <div
                className="px-4 py-4 flex items-center gap-3"
                style={{ borderBottom: "1.5px dashed rgba(42,24,16,0.25)" }}
              >
                <div
                  className="w-10 h-10 rounded-full grid place-items-center font-display font-bold text-lg shrink-0"
                  style={{
                    background: circleColor,
                    color: "var(--color-paper)",
                    border: "1.5px solid var(--color-ink)",
                  }}
                >
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{name}</div>
                  {user?.email && user.email !== name && (
                    <div className="text-xs text-ink-soft truncate">
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                }}
                className="w-full px-4 py-3 text-left font-medium transition-colors hover:bg-[var(--color-paper-deep)]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
