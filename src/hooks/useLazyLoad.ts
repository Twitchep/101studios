import { useState, useCallback } from "react";

interface UseLazyLoadOptions {
  initialCount?: number;
  incrementCount?: number;
}

export function useLazyLoad<T>(
  items: T[],
  options: UseLazyLoadOptions = {}
) {
  const { initialCount = 6, incrementCount = 3 } = options;
  const [displayedCount, setDisplayedCount] = useState(initialCount);

  const displayedItems = items.slice(0, displayedCount);
  const hasMore = displayedCount < items.length;

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) => Math.min(prev + incrementCount, items.length));
  }, [items.length, incrementCount]);

  const loadAll = useCallback(() => {
    setDisplayedCount(items.length);
  }, [items.length]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    loadAll,
    totalCount: items.length,
    displayedCount,
  };
}
