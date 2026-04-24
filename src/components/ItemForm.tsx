import { useState } from "react";
import type { Item } from "../lib/types";
import { api } from "../lib/api";
import { placeholderDoodle, placeholderStyle } from "../lib/placeholder";

export default function ItemForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = "Save",
}: {
  initial?: Partial<Item>;
  onSubmit: (values: {
    name: string;
    notes: string;
    tags: string[];
    imageKey: string | null;
  }) => void;
  onCancel: () => void;
  submitting: boolean;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [imageKey, setImageKey] = useState<string | null>(
    initial?.imageKey ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const placeholderSeed = initial?.placeholderSeed ?? 0;

  const addTag = (raw: string) => {
    const clean = raw.trim().toLowerCase().replace(/^#/, "");
    if (!clean || tags.includes(clean) || tags.length >= 20) return;
    setTags([...tags, clean]);
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const { key } = await api.uploadImage(file);
      setImageKey(key);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({
          name: name.trim(),
          notes: notes.trim(),
          tags,
          imageKey,
        });
      }}
      className="flex flex-col gap-5"
    >
      <div>
        <label className="block text-sm font-semibold mb-1.5">Name</label>
        <input
          className="input"
          placeholder="e.g. 1972 Sriracha inaugural bottle"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={160}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">
          Photo <span className="font-normal text-ink-soft italic">(optional)</span>
        </label>
        <div className="flex items-start gap-4">
          <div
            className="w-28 h-28 rounded-xl overflow-hidden shrink-0 grid place-items-center"
            style={{ border: "1.5px solid var(--color-ink)" }}
          >
            {imageKey ? (
              <img
                src={`/img/thumb/${imageKey}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full grid place-items-center"
                style={placeholderStyle(placeholderSeed)}
              >
                <span className="text-3xl text-paper font-bold">
                  {placeholderDoodle(placeholderSeed)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label
              className="btn-ghost inline-flex cursor-pointer text-sm"
              style={{ width: "fit-content" }}
            >
              {uploading ? "Uploading…" : imageKey ? "Replace photo" : "Upload a photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </label>
            {imageKey && (
              <button
                type="button"
                className="text-sm underline text-ink-soft text-left"
                onClick={() => setImageKey(null)}
              >
                Remove photo
              </button>
            )}
            {!imageKey && (
              <p className="text-xs text-ink-soft italic">
                No photo? No worries — we'll give it a colorful placeholder.
              </p>
            )}
            {uploadError && (
              <p className="text-xs" style={{ color: "var(--color-tomato-deep)" }}>
                {uploadError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">
          Notes <span className="font-normal text-ink-soft italic">(optional)</span>
        </label>
        <textarea
          className="input min-h-[90px] resize-y"
          placeholder="where you got it, why it matters, the story…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">Tags</label>
        <div
          className="flex flex-wrap items-center gap-2 p-2 rounded-xl"
          style={{ border: "1.5px solid var(--color-ink)", background: "var(--color-paper)" }}
        >
          {tags.map((t) => (
            <span key={t} className="chip chip-active">
              #{t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="ml-1"
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1 px-2"
            placeholder={tags.length ? "" : "rare, 1990s, mint…"}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(tagInput);
                setTagInput("");
              } else if (e.key === "Backspace" && !tagInput && tags.length) {
                setTags(tags.slice(0, -1));
              }
            }}
            onBlur={() => {
              if (tagInput.trim()) {
                addTag(tagInput);
                setTagInput("");
              }
            }}
            maxLength={40}
          />
        </div>
        <p className="text-xs text-ink-soft mt-1 italic">
          press enter or comma to add. backspace to unstick.
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || uploading}
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
