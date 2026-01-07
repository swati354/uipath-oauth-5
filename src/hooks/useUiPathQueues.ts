/**
 * React Query hooks for UiPath Queues
 *
 * Provides methods to:
 * - Fetch all queues
 * - Get queue by ID
 *
 * Note: Queue item management (add/update/delete items) is not yet available in the SDK.
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import type { QueueGetResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath queues
 *
 * @param folderId - Optional folder ID to filter queues
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathQueues(folderId?: number, enabled = true): UseQueryResult<QueueGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'queues', folderId, enabled], // Include enabled in queryKey to force refetch
		queryFn: async (): Promise<QueueGetResponse[]> => {
			const uipath = getUiPath();
			const result = await uipath.queues.getAll(
				folderId ? { folderId } : undefined
			);
			// Handle both paginated and direct array responses
			if (Array.isArray(result)) {
				return result;
			}
			return (result as any).items || [];
		},
		enabled: enabled,
		refetchInterval: 10000,
		refetchOnMount: true,
		staleTime: 0,
	});
}

/**
 * Get a specific queue by ID
 *
 * @param queueId - The queue ID
 * @param folderId - Required folder ID
 */
export function useUiPathQueue(queueId: number | undefined, folderId: number): UseQueryResult<QueueGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'queues', queueId, folderId],
		queryFn: async (): Promise<QueueGetResponse> => {
			if (!queueId) throw new Error('Queue ID is required');
			const uipath = getUiPath();
			return await uipath.queues.getById(queueId, folderId);
		},
		enabled: !!queueId,
		refetchInterval: 10000,
	});
}

