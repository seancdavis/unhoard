import { useEffect, useState } from "react";
import Header from "../components/Header";
import CollectionCard from "../components/CollectionCard";
import Modal from "../components/Modal";
import CollectionForm from "../components/CollectionForm";
import { api } from "../lib/api";
import type { Collection } from "../lib/types";
import { useAuth, getDisplayName } from "../lib/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .listCollections()
      .then(setCollections)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Something went wrong"),
      );
  }, []);

  const firstName = getDisplayName(user).split(/\s+/)[0];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-display italic text-ink-soft text-lg">
              welcome back,
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              {firstName}'s shelves
            </h1>
          </div>
          <button className="btn-primary" onClick={() => setCreating(true)}>
            <span className="text-lg">+</span> New collection
          </button>
        </div>

        {error && (
          <div
            className="zine-card p-4 mb-6"
            style={{ background: "var(--color-blush)" }}
          >
            <strong>Hmm.</strong> {error}
          </div>
        )}

        {collections === null ? (
          <div className="font-display italic text-ink-soft">loading…</div>
        ) : collections.length === 0 ? (
          <EmptyState onCreate={() => setCreating(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((c, i) => (
              <CollectionCard key={c.id} collection={c} index={i} />
            ))}
          </div>
        )}
      </main>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Start a new collection"
      >
        <CollectionForm
          submitting={submitting}
          submitLabel="Create"
          onCancel={() => setCreating(false)}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              const created = await api.createCollection(values);
              setCollections((prev) => [created, ...(prev ?? [])]);
              setCreating(false);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed to create");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Modal>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className="zine-card p-10 md:p-16 text-center max-w-2xl mx-auto"
      style={{ transform: "rotate(-0.8deg)" }}
    >
      <div className="text-6xl mb-4 float-soft inline-block">📦</div>
      <h2 className="font-display text-3xl font-semibold mb-3">
        Nothing on the shelves yet.
      </h2>
      <p className="text-ink-soft mb-6 leading-relaxed">
        What's the thing you can't stop buying/finding/rescuing?
        <br />
        Start there.
      </p>
      <button className="btn-primary" onClick={onCreate}>
        Start a collection
      </button>
    </div>
  );
}
