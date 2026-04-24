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

type Tab = "collection" | "wishlist";

export default function CollectionPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);
  const [wishlist, setWishlist] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("collection");
  const [adding, setAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingCollection, setEditingCollection] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    api
      .getCollection(id)
      .then(({ collection, items, wishlist }) => {
        setCollection(collection);
        setItems(items);
        setWishlist(wishlist);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Couldn't load collection"),
      );
  }, [id]);

  const source = activeTab === "collection" ? items : wishlist;

  const allTags = useMemo(() => {
    if (!source) return [];
    const counts = new Map<string, number>();
    for (const it of source) {
      for (const t of it.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [source]);

  const filtered = useMemo(() => {
    if (!source) return [];
    if (!activeTag) return source;
    return source.filter((it) => it.tags.includes(activeTag));
  }, [source, activeTag]);

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

  if (!collection || !items || !wishlist) {
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

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setActiveTag(null);
  };

  const handleDeleteCollection = async () => {
    if (!confirm("Delete this whole collection and everything in it?")) return;
    try {
      await api.deleteCollection(collection.id);
      navigate("/dashboard");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't delete");
    }
  };

  const removeFromList = (itemId: string, fromWishlist: boolean) => {
    if (fromWishlist) {
      setWishlist((prev) => prev?.filter((it) => it.id !== itemId) ?? null);
    } else {
      setItems((prev) => prev?.filter((it) => it.id !== itemId) ?? null);
    }
  };

  const handleDeleteItem = async (item: Item) => {
    const label = item.isWishlist ? "wish" : "piece";
    if (!confirm(`Remove this ${label}?`)) return;
    try {
      await api.deleteItem(item.id);
      removeFromList(item.id, item.isWishlist);
      setEditingItem(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't delete");
    }
  };

  const handleMoveToCollection = async (item: Item) => {
    setSubmitting(true);
    try {
      const updated = await api.updateItem(item.id, { isWishlist: false });
      setWishlist((prev) => prev?.filter((it) => it.id !== item.id) ?? null);
      setItems((prev) => [updated, ...(prev ?? [])]);
      setEditingItem(null);
      setActiveTab("collection");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't move");
    } finally {
      setSubmitting(false);
    }
  };

  const addLabel = activeTab === "collection" ? "Add item" : "Add to wishlist";
  const addTitle =
    activeTab === "collection" ? "Add to the collection" : "Add to the wishlist";

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
                {wishlist.length > 0 && (
                  <> · {wishlist.length} on the wishlist</>
                )}
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
            <button className="btn-primary" onClick={() => setAdding(true)}>
              <span className="text-lg">+</span> {addLabel}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2 border-b-2 border-ink/10">
          <TabButton
            active={activeTab === "collection"}
            onClick={() => switchTab("collection")}
          >
            Collection <span className="opacity-60">· {items.length}</span>
          </TabButton>
          <TabButton
            active={activeTab === "wishlist"}
            onClick={() => switchTab("wishlist")}
          >
            Wishlist <span className="opacity-60">· {wishlist.length}</span>
          </TabButton>
        </div>

        {allTags.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
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
            ) : activeTab === "collection" ? (
              <EmptyCollection onAdd={() => setAdding(true)} />
            ) : (
              <EmptyWishlist onAdd={() => setAdding(true)} />
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

      <Modal open={adding} onClose={() => setAdding(false)} title={addTitle}>
        <ItemForm
          submitting={submitting}
          submitLabel="Add"
          onCancel={() => setAdding(false)}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              const created = await api.createItem({
                collectionId: collection.id,
                isWishlist: activeTab === "wishlist",
                ...values,
              });
              if (created.isWishlist) {
                setWishlist((prev) => [created, ...(prev ?? [])]);
              } else {
                setItems((prev) => [created, ...(prev ?? [])]);
              }
              setAdding(false);
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
        title={editingItem?.isWishlist ? "Edit wish" : "Edit item"}
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
                  const list = updated.isWishlist ? "wishlist" : "items";
                  if (list === "wishlist") {
                    setWishlist(
                      (prev) =>
                        prev?.map((it) =>
                          it.id === updated.id ? updated : it,
                        ) ?? null,
                    );
                  } else {
                    setItems(
                      (prev) =>
                        prev?.map((it) =>
                          it.id === updated.id ? updated : it,
                        ) ?? null,
                    );
                  }
                  setEditingItem(null);
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Couldn't save");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
            {editingItem.isWishlist && (
              <button
                className="btn-ghost text-sm self-start"
                disabled={submitting}
                onClick={() => handleMoveToCollection(editingItem)}
              >
                ✓ Move to collection
              </button>
            )}
            <button
              className="text-sm underline text-left"
              style={{ color: "var(--color-tomato-deep)" }}
              onClick={() => handleDeleteItem(editingItem)}
            >
              Delete this {editingItem.isWishlist ? "wish" : "item"}
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

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`font-display text-lg font-semibold px-4 py-2 -mb-[2px] border-b-2 transition-colors ${
        active
          ? "border-ink text-ink"
          : "border-transparent text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyCollection({ onAdd }: { onAdd: () => void }) {
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

function EmptyWishlist({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="zine-card p-10 md:p-14 text-center max-w-xl mx-auto"
      style={{ transform: "rotate(-0.8deg)" }}
    >
      <div className="text-6xl mb-4 float-soft inline-block">✧</div>
      <h2 className="font-display text-2xl font-semibold mb-2">
        Nothing on the wishlist yet.
      </h2>
      <p className="text-ink-soft mb-6">
        Stash the things you're hoping to track down. Move them over when they
        arrive.
      </p>
      <button className="btn-primary" onClick={onAdd}>
        Add to wishlist
      </button>
    </div>
  );
}
