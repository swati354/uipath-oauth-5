/**
 * React Query hooks for UiPath Tasks (Action Center)
 *
 * Provides methods to:
 * - Fetch all tasks
 * - Assign tasks to users
 * - Complete tasks
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { getUiPath } from '../lib/uipath';
import { toast } from 'sonner';
import type { RawTaskGetResponse, TaskAssignmentResponse, TaskType } from 'uipath-sdk';

/**
 * Fetch all UiPath tasks
 *
 * @param folderId - Optional folder ID to filter tasks
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUiPathTasks(folderId?: number, enabled = true): UseQueryResult<RawTaskGetResponse[], Error> {
	return useQuery({
		queryKey: ['uipath', 'tasks', folderId, enabled], // Include enabled in queryKey to force refetch
		queryFn: async (): Promise<RawTaskGetResponse[]> => {
			const uipath = getUiPath();
			const result = await uipath.tasks.getAll(
				folderId ? { folderId } : undefined
			);
			// Handle both paginated and direct array responses
			if (Array.isArray(result)) {
				return result;
			}
			return (result as any).items || [];
		},
		enabled: enabled,
		refetchInterval: 15000,
		refetchOnMount: true,
		staleTime: 0,
	});
}

/**
 * Mutation to assign a task to a user
 */
export function useAssignTask(): UseMutationResult<TaskAssignmentResponse[], Error, { taskId: number; userNameOrEmail: string }> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ taskId, userNameOrEmail }: { taskId: number; userNameOrEmail: string }): Promise<TaskAssignmentResponse[]> => {
			const uipath = getUiPath();
			if (!uipath.isAuthenticated()) {
				throw new Error('UiPath SDK not authenticated. Please authenticate first.');
			}
			const result = await uipath.tasks.assign({ taskId, userNameOrEmail });
			return result.data as TaskAssignmentResponse[];
		},
		onSuccess: () => {
			toast.success('Task assigned successfully');
			// Invalidate tasks query to refresh the list
			queryClient.invalidateQueries({ queryKey: ['uipath', 'tasks'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to assign task: ${error.message}`);
		},
	});
}

type CompleteTaskParams = 
	| ({ taskId: number; type: TaskType.External; data?: Record<string, unknown>; action?: string; folderId: number })
	| ({ taskId: number; type: TaskType.App | TaskType.Form; data: Record<string, unknown>; action: string; folderId: number });

/**
 * Mutation to complete a task
 *
 * Supports all task types:
 * - External tasks: data and action are optional
 * - App/Form tasks: data and action are required
 *
 * @example
 * ```tsx
 * const completeTask = useCompleteTask();
 *
 * // Complete an App task
 * completeTask.mutate({
 *   taskId: 123,
 *   type: TaskType.App,
 *   action: 'approve',
 *   data: { approved: true },
 *   folderId: 456
 * });
 *
 * // Complete an External task
 * completeTask.mutate({
 *   taskId: 789,
 *   type: TaskType.External,
 *   folderId: 456
 * });
 * ```
 */
export function useCompleteTask(): UseMutationResult<void, Error, CompleteTaskParams> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: CompleteTaskParams): Promise<void> => {
			const uipath = getUiPath();
			if (!uipath.isAuthenticated()) {
				throw new Error('UiPath SDK not authenticated. Please authenticate first.');
			}
			const { taskId, type, folderId, data, action } = params;
			await uipath.tasks.complete(
				{
					type,
					taskId,
					...(data !== undefined && { data }),
					...(action !== undefined && { action }),
				} as any,
				folderId
			);
		},
		onSuccess: () => {
			toast.success('Task completed successfully');
			// Invalidate tasks query to refresh the list
			queryClient.invalidateQueries({ queryKey: ['uipath', 'tasks'] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to complete task: ${error.message}`);
		},
	});
}
