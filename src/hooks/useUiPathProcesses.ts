/**
 * React Query hook for UiPath Processes
 *
 * Provides methods to:
 * - Fetch all processes
 * - Start a process
 * - Get process by ID
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import { toast } from 'sonner';
import type { ProcessGetResponse, ProcessStartResponse } from 'uipath-sdk';

/**
 * Fetch all UiPath processes
 *
 * @param folderId - Optional folder ID to filter processes
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathProcesses(folderId?: number, enabled = true): UseQueryResult<ProcessGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'processes', folderId, enabled], // Include enabled in queryKey to force refetch
		queryFn: async (): Promise<ProcessGetResponse[]> => {
			const uipath = getUiPath();
			const isAuthenticated = uipath.isAuthenticated();
			
			// Return empty array if not authenticated - don't throw error
			if (!isAuthenticated) {
				return [];
			}
			
			const result = await uipath.processes.getAll(
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
		refetchOnMount: true,
		staleTime: 0, // Consider data stale immediately when enabled changes
	});
}

/**
 * Get a specific process by ID
 *
 * @param processId - The process ID
 * @param folderId - Required folder ID
 */
export function useUiPathProcess(processId: number | undefined, folderId: number): UseQueryResult<ProcessGetResponse, Error> {
	return useQuery({
		queryKey: ['uipath', 'processes', processId, folderId],
		queryFn: async (): Promise<ProcessGetResponse> => {
			if (!processId) throw new Error('Process ID is required');
			const uipath = getUiPath();
			return await uipath.processes.getById(processId, folderId);
		},
		enabled: !!processId,
		refetchInterval: 30000,
	});
}

/**
 * Mutation to start a UiPath process
 *
 * Note: Returns an array of jobs created. Typically one job, but can be multiple
 * if the process is configured to run on multiple robots.
 */
export function useStartProcess(): UseMutationResult<ProcessStartResponse[], Error, { processKey: string; folderId: number }> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			processKey,
			folderId,
		}: {
			processKey: string;
			folderId: number;
		}): Promise<ProcessStartResponse[]> => {
			const uipath = getUiPath();
			if (!uipath.isAuthenticated()) {
				throw new Error('UiPath SDK not authenticated. Please authenticate first.');
			}
			return await uipath.processes.start({ processKey }, folderId);
		},
		onSuccess: () => {
			toast.success('Process started successfully');
			// Invalidate processes query to refresh the list
			queryClient.invalidateQueries({ queryKey: ['uipath', 'processes'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to start process: ${error.message}`);
		},
	});
}
