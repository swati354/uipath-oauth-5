import { useState, useCallback } from 'react';
import { getUiPath } from '../lib/uipath';
import type { EntityRecord, PaginatedResponse, PaginationCursor } from 'uipath-sdk';

export interface UseEntityRecordsReturn {
  records: EntityRecord[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  nextCursor?: PaginationCursor;
  totalCount?: number;
  fetchRecords: (entityId: string, options?: {
    expansionLevel?: number;
    pageSize?: number;
    cursor?: PaginationCursor;
  }) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export function useEntityRecords(): UseEntityRecordsReturn {
  const [records, setRecords] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<PaginationCursor | undefined>();
  const [totalCount, setTotalCount] = useState<number | undefined>();
  const [currentEntityId, setCurrentEntityId] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState<{
    expansionLevel?: number;
    pageSize?: number;
  }>({});

  const fetchRecords = useCallback(async (
    entityId: string,
    options?: {
      expansionLevel?: number;
      pageSize?: number;
      cursor?: PaginationCursor;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log('[useEntityRecords] Fetching records for entity:', entityId, options);

      // Build options object with only defined values to avoid SDK errors
      const requestOptions: {
        expansionLevel: number;
        pageSize: number;
        cursor?: PaginationCursor;
      } = {
        expansionLevel: options?.expansionLevel ?? 0,
        pageSize: options?.pageSize ?? 50,
      };

      // Only add cursor if it's defined
      if (options?.cursor) {
        requestOptions.cursor = options.cursor;
      }

      const response: PaginatedResponse<EntityRecord> = await getUiPath().entities.getRecordsById(
        entityId,
        requestOptions
      );

      console.log('[useEntityRecords] Fetched records:', response , 'records');

      // If using cursor, append to existing records, otherwise replace
      if (options?.cursor) {
        setRecords(prev => [...prev, ...response.items]);
      } else {
        setRecords(response.items);
        setCurrentEntityId(entityId);
        setCurrentOptions({
          expansionLevel: options?.expansionLevel,
          pageSize: options?.pageSize,
        });
      }

      setHasNextPage(response.hasNextPage);
      setNextCursor(response.nextCursor);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error('[useEntityRecords] Error fetching records:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch entity records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || !nextCursor || !currentEntityId || loading) {
      return;
    }

    await fetchRecords(currentEntityId, {
      ...currentOptions,
      cursor: nextCursor,
    });
  }, [hasNextPage, nextCursor, currentEntityId, currentOptions, loading, fetchRecords]);

  const reset = useCallback(() => {
    setRecords([]);
    setLoading(false);
    setError(null);
    setHasNextPage(false);
    setNextCursor(undefined);
    setTotalCount(undefined);
    setCurrentEntityId(null);
    setCurrentOptions({});
  }, []);

  return {
    records,
    loading,
    error,
    hasNextPage,
    nextCursor,
    totalCount,
    fetchRecords,
    loadMore,
    reset,
  };
}
