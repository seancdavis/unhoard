import { Link } from "react-router-dom";
import type { Collection } from "../lib/types";
import { ACCENT_HEX } from "../lib/types";

export default function CollectionCard({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) {
  const accent =
    ACCENT_HEX[collection.accent as keyof typeof ACCENT_HEX] ?? ACCENT_HEX.tomato;
  const tilt = [-1.2, 0.8, -0.4, 1.5, -1.8, 0.3][index % 6];

  return (
    <Link
      to={`/c/${collection.id}`}
      className="zine-card block p-6 relative"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div
        className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl grid place-items-center text-xl"
        style={{
          background: accent,
          border: "1.5px solid var(--color-ink)",
          boxShadow: "2px 2px 0 var(--color-ink)",
          transform: "rotate(8deg)",
        }}
      >
        {collection.emoji}
      </div>

      <h3 className="font-display text-2xl font-semibold pr-10 leading-tight">
        {collection.name}
      </h3>
      <div className="mt-3 text-sm text-ink-soft font-medium">
        {collection.itemCount === 1
          ? "1 item"
          : `${collection.itemCount ?? 0} items`}
      </div>

      <div
        className="mt-6 h-1.5 rounded-full"
        style={{ background: accent, opacity: 0.6 }}
      />
    </Link>
  );
}
