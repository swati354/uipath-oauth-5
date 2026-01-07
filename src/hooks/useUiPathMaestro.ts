/**
 * React hook for UiPath Maestro
 *
 * Provides methods to:
 * - Fetch Maestro processes
 * - Fetch process instances (all or by ID)
 * - Fetch BPMN diagrams
 * - Fetch execution history
 * - Control instances (pause, resume, cancel)
 */

import { useState, useEffect, useCallback } from 'react';
import { getUiPath } from '../lib/uipath';
import { toast } from 'sonner';
import type { MaestroProcessGetAllResponse,ProcessInstanceGetResponse, RawProcessInstanceGetResponse, ProcessInstanceOperationResponse, ProcessInstanceExecutionHistoryResponse, ProcessInstanceGetVariablesResponse, ProcessInstanceGetVariablesOptions } from 'uipath-sdk';

interface UseUiPathMaestroProcessesResult {
	data?: MaestroProcessGetAllResponse[];
	isLoading: boolean;
	error?: Error;
	refetch: () => Promise<void>;
}

interface UseUiPathMaestroInstancesResult {
	data?: RawProcessInstanceGetResponse[];
	isLoading: boolean;
	error?: Error;
	refetch: () => Promise<void>;
}

interface UseUiPathMaestroInstanceByIdResult {
	data?: RawProcessInstanceGetResponse;
	isLoading: boolean;
	error?: Error;
	refetch: () => Promise<void>;
}

/**
 * Fetch all Maestro processes
 */
export function useUiPathMaestroProcesses(): UseUiPathMaestroProcessesResult {
	const [data, setData] = useState<MaestroProcessGetAllResponse[]>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const fetchProcesses = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.getAll();
			if (Array.isArray(result)) {
				setData(result);
			} else {
				setData((result as any).items || []);
			}
		} catch (error) {
			console.error('Failed to fetch Maestro processes:', error);
			setError(error instanceof Error ? error : new Error('Failed to fetch Maestro processes'));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProcesses();

		// Auto-refresh every 30 seconds
		const interval = setInterval(fetchProcesses, 30000);
		return () => clearInterval(interval);
	}, [fetchProcesses]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchProcesses
	};
}

/**
 * Fetch all Maestro process instances
 */
export function useUiPathMaestroInstances(): UseUiPathMaestroInstancesResult {
	const [data, setData] = useState<RawProcessInstanceGetResponse[]>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const fetchInstances = useCallback(async (): Promise<void> => {
		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.instances.getAll();
			if (Array.isArray(result)) {
				setData(result);
			} else {
				setData((result as any).items || []);
			}
		} catch (error) {
			console.error('Failed to fetch Maestro instances:', error);
			setError(error instanceof Error ? error : new Error('Failed to fetch Maestro instances'));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchInstances();

		// Auto-refresh every 10 seconds for more frequent active monitoring
		const interval = setInterval(fetchInstances, 10000);
		return () => clearInterval(interval);
	}, [fetchInstances]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchInstances
	};
}

/**
 * Fetch a single Maestro process instance by ID
 *
 * @param instanceId - The unique identifier of the process instance
 * @param folderKey - The folder key where the instance resides
 * @param options - Optional query options
 */
export function useUiPathMaestroInstanceById(
	instanceId: string | undefined,
	folderKey: string | undefined,
	options?: { enabled?: boolean }
): UseUiPathMaestroInstanceByIdResult {
	const [data, setData] = useState<RawProcessInstanceGetResponse>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const enabled = options?.enabled !== false && !!instanceId && !!folderKey;

	const fetchInstance = useCallback(async (): Promise<void> => {
		if (!instanceId || !folderKey || !enabled) return;

		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result: ProcessInstanceGetResponse = await uipath.maestro.processes.instances.getById(instanceId, folderKey);
			setData(result);
		} catch (error) {
			console.error(`Failed to fetch Maestro instance ${instanceId}:`, error);
			setError(error instanceof Error ? error : new Error('Failed to fetch Maestro instance'));
		} finally {
			setIsLoading(false);
		}
	}, [instanceId, folderKey, enabled]);

	useEffect(() => {
		fetchInstance();

		// Auto-refresh every 5 seconds if enabled for frequent real-time instance monitoring
		if (enabled) {
			const interval = setInterval(fetchInstance, 5000);
			return () => clearInterval(interval);
		}
	}, [fetchInstance, enabled]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchInstance
	};
}

interface UsePauseMaestroInstanceResult {
	mutate: (params: { instanceId: string; folderKey: string; comment?: string; onSuccess?: (data: ProcessInstanceOperationResponse) => void }) => Promise<ProcessInstanceOperationResponse>;
	isLoading: boolean;
	error?: Error;
}

/**
 * Mutation to pause a Maestro process instance
 */
export function usePauseMaestroInstance(onInstancesRefresh?: () => void): UsePauseMaestroInstanceResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const mutate = useCallback(async ({
		instanceId,
		folderKey,
		comment,
		onSuccess
	}: {
		instanceId: string;
		folderKey: string;
		comment?: string;
		onSuccess?: (data: ProcessInstanceOperationResponse) => void;
	}): Promise<ProcessInstanceOperationResponse> => {
		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.instances.pause(
				instanceId,
				folderKey,
				comment ? { comment } : undefined
			);
			const data = result as ProcessInstanceOperationResponse;
			toast.success('Maestro instance paused');
			onSuccess?.(data);
			onInstancesRefresh?.();
			return data;
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Failed to pause instance');
			setError(err);
			toast.error(`Failed to pause instance: ${err.message}`);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [onInstancesRefresh]);

	return {
		mutate,
		isLoading,
		error
	};
}

interface UseResumeMaestroInstanceResult {
	mutate: (params: { instanceId: string; folderKey: string; comment?: string; onSuccess?: (data: ProcessInstanceOperationResponse) => void }) => Promise<ProcessInstanceOperationResponse>;
	isLoading: boolean;
	error?: Error;
}

/**
 * Mutation to resume a Maestro process instance
 */
export function useResumeMaestroInstance(onInstancesRefresh?: () => void): UseResumeMaestroInstanceResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const mutate = useCallback(async ({
		instanceId,
		folderKey,
		comment,
		onSuccess
	}: {
		instanceId: string;
		folderKey: string;
		comment?: string;
		onSuccess?: (data: ProcessInstanceOperationResponse) => void;
	}): Promise<ProcessInstanceOperationResponse> => {
		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.instances.resume(
				instanceId,
				folderKey,
				comment ? { comment } : undefined
			);
			const data = result as ProcessInstanceOperationResponse;
			toast.success('Maestro instance resumed');
			onSuccess?.(data);
			onInstancesRefresh?.();
			return data;
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Failed to resume instance');
			setError(err);
			toast.error(`Failed to resume instance: ${err.message}`);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [onInstancesRefresh]);

	return {
		mutate,
		isLoading,
		error
	};
}

interface UseCancelMaestroInstanceResult {
	mutate: (params: { instanceId: string; folderKey: string; comment?: string; onSuccess?: (data: ProcessInstanceOperationResponse) => void }) => Promise<ProcessInstanceOperationResponse>;
	isLoading: boolean;
	error?: Error;
}

/**
 * Mutation to cancel a Maestro process instance
 */
export function useCancelMaestroInstance(onInstancesRefresh?: () => void): UseCancelMaestroInstanceResult {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const mutate = useCallback(async ({
		instanceId,
		folderKey,
		comment,
		onSuccess
	}: {
		instanceId: string;
		folderKey: string;
		comment?: string;
		onSuccess?: (data: ProcessInstanceOperationResponse) => void;
	}): Promise<ProcessInstanceOperationResponse> => {
		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.instances.cancel(
				instanceId,
				folderKey,
				comment ? { comment } : undefined
			);
			const data = result as ProcessInstanceOperationResponse;
			toast.success('Maestro instance cancelled');
			onSuccess?.(data);
			onInstancesRefresh?.();
			return data;
		} catch (error) {
			const err = error instanceof Error ? error : new Error('Failed to cancel instance');
			setError(err);
			toast.error(`Failed to cancel instance: ${err.message}`);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [onInstancesRefresh]);

	return {
		mutate,
		isLoading,
		error
	};
}

interface UseUiPathMaestroBpmnDiagramResult {
	data?: string;
	isLoading: boolean;
	error?: Error;
	refetch: () => Promise<void>;
}

/**
 * Fetch BPMN diagram for a Maestro process instance
 *
 * Returns the BPMN XML diagram data for visualization.
 * The diagram shows the process flow with current execution status.
 *
 * @param instanceId - The unique identifier of the process instance
 * @param folderKey - The folder key where the instance resides
 * @param options - Optional query options
 */
export function useUiPathMaestroBpmnDiagram(
	instanceId: string | undefined,
	folderKey: string | undefined,
	options?: { enabled?: boolean }
): UseUiPathMaestroBpmnDiagramResult {
	const [data, setData] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const enabled = options?.enabled !== false && !!instanceId && !!folderKey;

	const fetchBpmnDiagram = useCallback(async (): Promise<void> => {
		if (!instanceId || !folderKey || !enabled) return;

		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.instances.getBpmn(instanceId, folderKey);
			setData(result);
		} catch (error) {
			console.error(`Failed to fetch BPMN diagram for instance ${instanceId}:`, error);
			setError(error instanceof Error ? error : new Error('Failed to fetch BPMN diagram'));
		} finally {
			setIsLoading(false);
		}
	}, [instanceId, folderKey, enabled]);

	useEffect(() => {
		fetchBpmnDiagram();

		// Auto-refresh every 10 seconds if enabled for moderate refresh to update execution status in diagram
		if (enabled) {
			const interval = setInterval(fetchBpmnDiagram, 10000);
			return () => clearInterval(interval);
		}
	}, [fetchBpmnDiagram, enabled]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchBpmnDiagram
	};
}

interface UseUiPathMaestroExecutionHistoryResult {
	data?: ProcessInstanceExecutionHistoryResponse[];
	isLoading: boolean;
	error?: Error;
	refetch: () => Promise<void>;
}

/**
 * Fetch execution history for a Maestro process instance
 *
 * Returns detailed execution history including all runs, activities, and status changes.
 * This is a separate API call from getting the instance itself.
 *
 * @param instanceId - The unique identifier of the process instance
 * @param options - Optional query options
 */
export function useUiPathMaestroExecutionHistory(
	instanceId: string | undefined,
	options?: { enabled?: boolean }
): UseUiPathMaestroExecutionHistoryResult {
	const [data, setData] = useState<ProcessInstanceExecutionHistoryResponse[]>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const enabled = options?.enabled !== false && !!instanceId;

	const fetchExecutionHistory = useCallback(async (): Promise<void> => {
		if (!instanceId || !enabled) return;

		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result = await uipath.maestro.processes.instances.getExecutionHistory(instanceId);
			setData(result);
		} catch (error) {
			console.error(`Failed to fetch execution history for instance ${instanceId}:`, error);
			setError(error instanceof Error ? error : new Error('Failed to fetch execution history'));
		} finally {
			setIsLoading(false);
		}
	}, [instanceId, enabled]);

	useEffect(() => {
		fetchExecutionHistory();

		// Auto-refresh every 5 seconds if enabled for frequent updates for real-time execution tracking
		if (enabled) {
			const interval = setInterval(fetchExecutionHistory, 5000);
			return () => clearInterval(interval);
		}
	}, [fetchExecutionHistory, enabled]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchExecutionHistory
	};
}

interface UseUiPathMaestroVariablesResult {
	data?: ProcessInstanceGetVariablesResponse;
	isLoading: boolean;
	error?: Error;
	refetch: () => Promise<void>;
}

/**
 * Fetch global variables for a Maestro process instance
 *
 * Returns all global variables associated with the process instance.
 * Variables can be filtered by parent element ID if needed.
 *
 * // Result structure:
	// - result.globalVariables: Array of GlobalVariableMetaData (id, name, type, elementId, source, value)
	// - result.elements: Array of ElementMetaData (metadata about BPMN elements)
	// - result.instanceId: The process instance ID
	// - result.parentElementId: Optional parent element ID if filtered
 * @param instanceId - The unique identifier of the process instance
 * @param folderKey - The folder key where the instance resides
 * @param variableOptions - Optional parameters for filtering variables (e.g., parentElementId)
 * @param queryOptions - Optional query options
 * 
 *
 */
export function useUiPathMaestroVariables(
	instanceId: string | undefined,
	folderKey: string | undefined,
	variableOptions?: ProcessInstanceGetVariablesOptions,
	queryOptions?: { enabled?: boolean }
): UseUiPathMaestroVariablesResult {
	const [data, setData] = useState<ProcessInstanceGetVariablesResponse>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error>();

	const enabled = queryOptions?.enabled !== false && !!instanceId && !!folderKey;

	const fetchVariables = useCallback(async (): Promise<void> => {
		if (!instanceId || !folderKey || !enabled) return;

		setIsLoading(true);
		setError(undefined);
		
		try {
			const uipath = getUiPath();
			const result: ProcessInstanceGetVariablesResponse = await uipath.maestro.processes.instances.getVariables(
				instanceId,
				folderKey,
				variableOptions
			);
			
			setData(result);
		} catch (error) {
			console.error(`Failed to fetch variables for instance ${instanceId}:`, error);
			setError(error instanceof Error ? error : new Error('Failed to fetch variables'));
		} finally {
			setIsLoading(false);
		}
	}, [instanceId, folderKey, variableOptions, enabled]);

	useEffect(() => {
		fetchVariables();

		// Auto-refresh every 10 seconds if enabled for moderate refresh for variable monitoring
		if (enabled) {
			const interval = setInterval(fetchVariables, 10000);
			return () => clearInterval(interval);
		}
	}, [fetchVariables, enabled]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchVariables
	};
}
