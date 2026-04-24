import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import ItemCard from "../components/ItemCard";
import Modal from "../components/Modal";
import ItemForm from "../components/ItemForm";
import CollectionForm from "../components/CollectionForm";
import { api } from "../lib/api";
import type { Collection, Item } from "../lib/types";
import { ACCENT_HEX, type Accent } from "../lib/types";

export default function CollectionPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingCollection, setEditingCollection] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCollection(id)
      .then(({ collection, items }) => {
        setCollection(collection);
        setItems(items);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Couldn't load collection"),
      );
  }, [id]);

  const allTags = useMemo(() => {
    if (!items) return [];
    const counts = new Map<string, number>();
    for (const it of items) {
      for (const t of it.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!activeTag) return items;
    return items.filter((it) => it.tags.includes(activeTag));
  }, [items, activeTag]);

  if (error) {
    return (
      <div>
        <Header />
        <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">
          <div className="zine-card p-6">Hmm. {error}</div>
        </main>
      </div>
    );
  }

  if (!collection || !items) {
    return (
      <div>
        <Header />
        <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">
          <p className="font-display italic text-ink-soft">loading the shelf…</p>
        </main>
      </div>
    );
  }

  const accent =
    ACCENT_HEX[collection.accent as keyof typeof ACCENT_HEX] ?? ACCENT_HEX.tomato;

  const handleDeleteCollection = async () => {
    if (!confirm("Delete this whole collection and everything in it?")) return;
    try {
      await api.deleteCollection(collection.id);
      navigate("/dashboard");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't delete");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Remove this piece from the collection?")) return;
    try {
      await api.deleteItem(itemId);
      setItems((prev) => prev?.filter((it) => it.id !== itemId) ?? null);
      setEditingItem(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't delete");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">
        <Link
          to="/dashboard"
          className="text-sm text-ink-soft font-medium hover:text-ink mb-6 inline-flex items-center gap-1"
        >
          ← all collections
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mt-3 mb-2">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl grid place-items-center text-3xl"
              style={{
                background: accent,
                border: "1.5px solid var(--color-ink)",
                boxShadow: "3px 3px 0 var(--color-ink)",
                transform: "rotate(-4deg)",
              }}
            >
              {collection.emoji}
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                {collection.name}
              </h1>
              <div className="mt-1 text-ink-soft font-medium">
                {items.length === 1 ? "1 item" : `${items.length} items`}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              className="btn-ghost text-sm"
              onClick={() => setEditingCollection(true)}
            >
              Edit
            </button>
            <button
              className="btn-ghost text-sm"
              onClick={handleDeleteCollection}
              style={{ color: "var(--color-tomato-deep)" }}
            >
              Delete
            </button>
            <button className="btn-primary" onClick={() => setAddingItem(true)}>
              <span className="text-lg">+</span> Add item
            </button>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-soft mr-1">
              filter by tag:
            </span>
            <button
              className={`chip ${activeTag === null ? "chip-active" : ""}`}
              onClick={() => setActiveTag(null)}
            >
              all
            </button>
            {allTags.map(({ tag, count }) => (
              <button
                key={tag}
                className={`chip ${activeTag === tag ? "chip-active" : ""}`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                #{tag} <span className="opacity-60">· {count}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8">
          {filtered.length === 0 ? (
            activeTag ? (
              <div
                className="zine-card p-8 text-center"
                style={{ transform: "rotate(0.6deg)" }}
              >
                <p className="font-display italic text-ink-soft">
                  nothing tagged <strong>#{activeTag}</strong> in here yet.
                </p>
              </div>
            ) : (
              <EmptyItems onAdd={() => setAddingItem(true)} />
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((item, i) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  index={i}
                  activeTag={activeTag}
                  onClick={() => setEditingItem(item)}
                  onTagClick={(t) => setActiveTag(activeTag === t ? null : t)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        open={addingItem}
        onClose={() => setAddingItem(false)}
        title="Add to the collection"
      >
        <ItemForm
          submitting={submitting}
          submitLabel="Add"
          onCancel={() => setAddingItem(false)}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              const created = await api.createItem({
                collectionId: collection.id,
                ...values,
              });
              setItems((prev) => [created, ...(prev ?? [])]);
              setAddingItem(false);
            } catch (e) {
              alert(e instanceof Error ? e.message : "Couldn't add");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Modal>

      <Modal
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit item"
      >
        {editingItem && (
          <div className="flex flex-col gap-4">
            <ItemForm
              initial={editingItem}
              submitting={submitting}
              submitLabel="Save"
              onCancel={() => setEditingItem(null)}
              onSubmit={async (values) => {
                setSubmitting(true);
                try {
                  const updated = await api.updateItem(editingItem.id, values);
                  setItems(
                    (prev) =>
                      prev?.map((it) =>
                        it.id === updated.id ? updated : it,
                      ) ?? null,
                  );
                  setEditingItem(null);
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Couldn't save");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
            <button
              className="text-sm underline text-left"
              style={{ color: "var(--color-tomato-deep)" }}
              onClick={() => handleDeleteItem(editingItem.id)}
            >
              Delete this item
            </button>
          </div>
        )}
      </Modal>

      <Modal
        open={editingCollection}
        onClose={() => setEditingCollection(false)}
        title="Edit collection"
      >
        <CollectionForm
          initial={collection}
          submitting={submitting}
          submitLabel="Save"
          onCancel={() => setEditingCollection(false)}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              const updated = await api.updateCollection(collection.id, {
                ...values,
                accent: values.accent as Accent,
              });
              setCollection(updated);
              setEditingCollection(false);
            } catch (e) {
              alert(e instanceof Error ? e.message : "Couldn't save");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      </Modal>
    </div>
  );
}

function EmptyItems({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="zine-card p-10 md:p-14 text-center max-w-xl mx-auto"
      style={{ transform: "rotate(0.8deg)" }}
    >
      <div className="text-6xl mb-4 float-soft inline-block">✷</div>
      <h2 className="font-display text-2xl font-semibold mb-2">
        The shelf is empty.
      </h2>
      <p className="text-ink-soft mb-6">
        Add the first piece. A photo, a few words, maybe a tag.
      </p>
      <button className="btn-primary" onClick={onAdd}>
        Add an item
      </button>
    </div>
  );
}
