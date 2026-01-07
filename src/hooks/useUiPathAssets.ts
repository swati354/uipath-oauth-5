/**
 * React Query hooks for UiPath Assets
 *
 * Provides methods to:
 * - Fetch all assets
 * - Get asset by ID
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import type { AssetGetResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath assets
 *
 * @param folderId - Optional folder ID to filter assets
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathAssets(folderId?: number, enabled = true): UseQueryResult<AssetGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'assets', folderId, enabled], // Include enabled in queryKey to force refetch
		queryFn: async (): Promise<AssetGetResponse[]> => {
			const uipath = getUiPath();
			const result = await uipath.assets.getAll(
				folderId ? { folderId } : undefined
			);
			// Handle both paginated and direct array responses
			if (Array.isArray(result)) {
				return result;
			}
			return (result as any).items || [];
		},
		enabled: enabled,
		refetchInterval: 30000,
	});
}

/**
 * Get a specific asset by ID
 *
 * @param assetId - The asset ID
 * @param folderId - Required folder ID
 */
export function useUiPathAsset(assetId: number | undefined, folderId: number): UseQueryResult<AssetGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'assets', assetId, folderId],
		queryFn: async (): Promise<AssetGetResponse> => {
			if (!assetId) throw new Error('Asset ID is required');
			const uipath = getUiPath();
			return await uipath.assets.getById(assetId, folderId);
		},
		enabled: !!assetId,
		refetchInterval: 30000,
	});
}