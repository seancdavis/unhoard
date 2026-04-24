import { useState } from "react";
import { ACCENTS, ACCENT_HEX, type Accent } from "../lib/types";

const EMOJI_CHOICES = ["✨", "📚", "🎵", "👟", "🧱", "🌱", "☕", "🍄", "🧸", "🖋️", "🕹️", "🌶️"];

export default function CollectionForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = "Save",
}: {
  initial?: { name: string; emoji: string; accent: string };
  onSubmit: (values: { name: string; emoji: string; accent: Accent }) => void;
  onCancel: () => void;
  submitting: boolean;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "✨");
  const [accent, setAccent] = useState<Accent>(
    (initial?.accent as Accent) ?? "tomato",
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), emoji, accent });
      }}
      className="flex flex-col gap-5"
    >
      <div>
        <label className="block text-sm font-semibold mb-1.5">
          What do you collect?
        </label>
        <input
          className="input"
          placeholder="e.g. novelty hot sauces"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={120}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Pick a sticker</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_CHOICES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className="w-10 h-10 rounded-xl grid place-items-center text-xl transition-transform hover:scale-110"
              style={{
                background:
                  emoji === e ? "var(--color-sun)" : "var(--color-paper-deep)",
                border: "1.5px solid var(--color-ink)",
                boxShadow:
                  emoji === e ? "2px 2px 0 var(--color-ink)" : "none",
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mood color</label>
        <div className="flex gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAccent(a)}
              aria-label={a}
              className="w-10 h-10 rounded-full transition-transform hover:scale-110"
              style={{
                background: ACCENT_HEX[a],
                border: "1.5px solid var(--color-ink)",
                boxShadow:
                  accent === a ? "3px 3px 0 var(--color-ink)" : "none",
                transform: accent === a ? "scale(1.05)" : "none",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
