import React from "react";
import { cn } from "@/lib/utils";

export type SuggestionItem = {
  id: string;
  name: string;
  brand?: string;
  image_url?: string;
  price?: number;
};

interface SearchSuggestionsProps {
  items: SuggestionItem[];
  visible: boolean;
  highlightedIndex: number;
  onHover: (index: number) => void;
  onSelect: (item: SuggestionItem) => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  items,
  visible,
  highlightedIndex,
  onHover,
  onSelect,
  className,
}) => {
  if (!visible || items.length === 0) return null;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-full mt-1 z-[100] max-h-80 overflow-auto rounded-md border bg-background shadow-card",
        className
      )}
      role="listbox"
      aria-label="Search suggestions"
    >
      {items.map((item, index) => (
        <button
          type="button"
          key={item.id}
          className={cn(
            "w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-muted transition-colors",
            highlightedIndex === index && "bg-muted"
          )}
          onMouseEnter={() => onHover(index)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item);
          }}
          role="option"
          aria-selected={highlightedIndex === index}
        >
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-8 w-8 rounded object-cover border"
            />
          ) : (
            <div className="h-8 w-8 rounded bg-muted" />
          )}
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium text-foreground text-sm">
              {item.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {item.brand || ""}
            </div>
          </div>
          {typeof item.price === "number" && (
            <div className="text-xs font-semibold text-primary whitespace-nowrap">
              PKR {item.price.toLocaleString()}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
