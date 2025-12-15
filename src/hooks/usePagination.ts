/**
 * Pagination Hook
 * Reusable cursor-based pagination
 */

import { useState, useCallback } from 'react';

interface PaginationOptions {
  pageSize?: number;
}

interface PaginationResult<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export function usePagination<T>(
  fetchFn: (
    cursor: string | null,
    limit: number
  ) => Promise<{ items: T[]; nextCursor: string | null }>,
  options: PaginationOptions = {}
): PaginationResult<T> {
  const { pageSize = 20 } = options;
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn(cursor, pageSize);
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load'));
    } finally {
      setIsLoading(false);
    }
  }, [cursor, fetchFn, hasMore, isLoading, pageSize]);

  const reset = useCallback(() => {
    setItems([]);
    setCursor(null);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, hasMore, isLoading, error, loadMore, reset };
}
