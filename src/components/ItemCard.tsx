import type { Item } from "../lib/types";
import { placeholderDoodle, placeholderStyle } from "../lib/placeholder";

export default function ItemCard({
  item,
  index,
  onClick,
  onTagClick,
  activeTag,
}: {
  item: Item;
  index: number;
  onClick: () => void;
  onTagClick: (tag: string) => void;
  activeTag: string | null;
}) {
  const tilt = [-0.8, 0.5, -0.3, 1.1, -1.4, 0.2][index % 6];

  return (
    <div
      className="zine-card overflow-hidden flex flex-col cursor-pointer group"
      style={{ transform: `rotate(${tilt}deg)` }}
      onClick={onClick}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          borderBottom: "1.5px solid var(--color-ink)",
        }}
      >
        {item.imageKey ? (
          <img
            src={`/img/card/${item.imageKey}`}
            alt={item.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full grid place-items-center"
            style={placeholderStyle(item.placeholderSeed)}
          >
            <span className="text-7xl opacity-80 text-paper font-bold select-none">
              {placeholderDoodle(item.placeholderSeed)}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h4 className="font-display text-lg font-semibold leading-tight line-clamp-2">
          {item.name}
        </h4>
        {item.notes && (
          <p className="text-sm text-ink-soft leading-snug line-clamp-2">
            {item.notes}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {item.tags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className={`chip text-[0.7rem] py-0.5 px-2 ${
                  activeTag === tag ? "chip-active" : ""
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
