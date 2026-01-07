/**
 * UiPath Dashboard Page
 *
 * Main dashboard showing overview of processes, queues, and tasks
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessCard } from '@/components/uipath/ProcessCard';
import { QueueMonitor } from '@/components/uipath/QueueMonitor';
import { TaskCard } from '@/components/uipath/TaskCard';
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { useUiPathQueues } from '@/hooks/useUiPathQueues';
import { useUiPathTasks, useAssignTask, useCompleteTask } from '@/hooks/useUiPathTasks';
import { AlertCircle, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DashboardPage() {
	const { data: processes, isLoading: processesLoading, error: processesError } = useUiPathProcesses();
	const { data: queues, isLoading: queuesLoading, error: queuesError } = useUiPathQueues();
	const { data: tasks, isLoading: tasksLoading, error: tasksError } = useUiPathTasks();

	const { mutate: startProcess, isPending: isStartingProcess } = useStartProcess();
	const { mutate: assignTask, isPending: isAssigningTask } = useAssignTask();
	const { mutate: completeTask, isPending: isCompletingTask } = useCompleteTask();

	const handleStartProcess = (processKey: string) => {
		startProcess({ processKey });
	};

	const handleAssignTask = (taskId: string) => {
		// In a real app, you'd have a dialog to select the user
		// For demo purposes, we'll use a placeholder email
		assignTask({ taskId, userNameOrEmail: 'user@example.com' });
	};

	const handleCompleteTask = (taskId: string) => {
		// In a real app, you'd have a form to collect task data
		// For demo purposes, we'll just complete with empty data
		completeTask({ taskId, action: 'submit' });
	};

	return (
		<main className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<header className="space-y-2">
					<div className="flex items-center gap-2">
						<Activity className="h-8 w-8 text-[#FA4616]" />
						<h1 className="text-3xl font-bold">UiPath Automation Dashboard</h1>
					</div>
					<p className="text-muted-foreground">
						Monitor and manage your UiPath Orchestrator processes, queues, and tasks
					</p>
				</header>

				{/* Tabs for different sections */}
				<Tabs defaultValue="processes" className="space-y-4">
					<TabsList>
						<TabsTrigger value="processes">Processes</TabsTrigger>
						<TabsTrigger value="queues">Queues</TabsTrigger>
						<TabsTrigger value="tasks">Tasks</TabsTrigger>
					</TabsList>

					{/* Processes Tab */}
					<TabsContent value="processes" className="space-y-4">
						{processesError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									Failed to load processes: {(processesError as Error).message}
								</AlertDescription>
							</Alert>
						)}

						{processesLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{processes && processes.length > 0 ? (
									processes.map((process: any) => (
										<ProcessCard
											key={process.id}
											process={{
												id: process.id,
												name: process.name,
												key: process.key,
												description: process.description,
											}}
											onStart={handleStartProcess}
											isStarting={isStartingProcess}
										/>
									))
								) : (
									<p className="col-span-full text-center text-muted-foreground py-12">
										No processes found. Create processes in UiPath Orchestrator to see them here.
									</p>
								)}
							</div>
						)}
					</TabsContent>

					{/* Queues Tab */}
					<TabsContent value="queues" className="space-y-4">
						{queuesError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									Failed to load queues: {(queuesError as Error).message}
								</AlertDescription>
							</Alert>
						)}

						{queuesLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{queues && queues.length > 0 ? (
									queues.map((queue: any) => (
										<QueueMonitor
											key={queue.id}
											queue={{
												id: queue.id,
												name: queue.name,
												description: queue.description,
												itemCounts: {
													new: queue.newItemsCount || 0,
													inProgress: queue.inProgressItemsCount || 0,
													failed: queue.failedItemsCount || 0,
													successful: queue.successfulItemsCount || 0,
												},
											}}
										/>
									))
								) : (
									<p className="col-span-full text-center text-muted-foreground py-12">
										No queues found. Create queues in UiPath Orchestrator to see them here.
									</p>
								)}
							</div>
						)}
					</TabsContent>

					{/* Tasks Tab */}
					<TabsContent value="tasks" className="space-y-4">
						{tasksError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									Failed to load tasks: {(tasksError as Error).message}
								</AlertDescription>
							</Alert>
						)}

						{tasksLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[1, 2, 3].map((i) => (
									<div key={i} className="h-72 bg-muted animate-pulse rounded-lg" />
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{tasks && tasks.length > 0 ? (
									tasks.map((task: any) => (
										<TaskCard
											key={task.id}
											task={{
												id: task.id,
												title: task.title,
												description: task.description,
												priority: task.priority || 'Medium',
												status: task.status || 'Pending',
												dueDate: task.dueDate,
												assignee: task.assignee,
											}}
											onAssign={handleAssignTask}
											onComplete={handleCompleteTask}
											isAssigning={isAssigningTask}
											isCompleting={isCompletingTask}
										/>
									))
								) : (
									<p className="col-span-full text-center text-muted-foreground py-12">
										No tasks found. Create tasks in UiPath Action Center to see them here.
									</p>
								)}
							</div>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
