/**
 * TaskCard Component
 *
 * Displays an Action Center task with assign and complete actions
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserPlus, CheckCircle, AlertCircle, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type TaskStatus = 'Unassigned' | 'Pending' | 'Completed';

interface TaskCardProps {
	task: {
		id: string;
		title: string;
		description?: string;
		priority: TaskPriority;
		status: TaskStatus;
		dueDate?: Date | string;
		assignee?: string;
	};
	onAssign?: (taskId: string) => void;
	onComplete?: (taskId: string) => void;
	isAssigning?: boolean;
	isCompleting?: boolean;
}

const priorityConfig: Record<
	TaskPriority,
	{ variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }
> = {
	Low: { variant: 'secondary', className: 'bg-gray-200 text-gray-800' },
	Medium: { variant: 'default', className: 'bg-blue-200 text-blue-800' },
	High: { variant: 'default', className: 'bg-orange-200 text-orange-800' },
	Critical: { variant: 'destructive', className: 'bg-red-200 text-red-800' },
};

export function TaskCard({ task, onAssign, onComplete, isAssigning, isCompleting }: TaskCardProps) {
	const dueDate = task.dueDate
		? typeof task.dueDate === 'string'
			? new Date(task.dueDate)
			: task.dueDate
		: null;

	const isOverdue = dueDate && dueDate < new Date();
	const priorityStyle = priorityConfig[task.priority];

	return (
		<Card className="hover:shadow-lg transition-shadow duration-200">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
						<CardDescription className="mt-1">
							{task.description || 'No description available'}
						</CardDescription>
					</div>
					<Badge variant={priorityStyle.variant} className={priorityStyle.className}>
						{task.priority}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 text-sm">
					{task.assignee && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<User className="w-4 h-4" />
							<span>Assigned to: {task.assignee}</span>
						</div>
					)}
					{dueDate && (
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span className={isOverdue ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
								Due: {format(dueDate, 'PPp')}
								{isOverdue && (
									<AlertCircle className="w-3 h-3 ml-1 inline text-red-500" />
								)}
							</span>
						</div>
					)}
					<div>
						<Badge variant="outline" className="text-xs">
							{task.status}
						</Badge>
					</div>
				</div>
			</CardContent>
			{(onAssign || onComplete) && task.status !== 'Completed' && (
				<CardFooter className="flex gap-2">
					{onAssign && task.status === 'Unassigned' && (
						<Button
							onClick={() => onAssign(task.id)}
							disabled={isAssigning}
							variant="outline"
							className="flex-1"
						>
							<UserPlus className="w-4 h-4 mr-2" />
							{isAssigning ? 'Assigning...' : 'Assign'}
						</Button>
					)}
					{onComplete && task.status === 'Pending' && (
						<Button
							onClick={() => onComplete(task.id)}
							disabled={isCompleting}
							variant="default"
							className="flex-1"
						>
							<CheckCircle className="w-4 h-4 mr-2" />
							{isCompleting ? 'Completing...' : 'Complete'}
						</Button>
					)}
				</CardFooter>
			)}
		</Card>
	);
}
