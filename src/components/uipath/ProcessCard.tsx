/**
 * ProcessCard Component
 *
 * Displays a UiPath process with status, description, and start action
 */

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Calendar, Key } from 'lucide-react';
import { JobStatusBadge, type JobStatus } from './JobStatusBadge';
import { format } from 'date-fns';

interface ProcessCardProps {
	process: {
		id: string;
		name: string;
		key: string;
		description?: string;
		lastExecutionStatus?: JobStatus;
		lastExecutionTime?: Date | string;
	};
	onStart?: (processKey: string) => void;
	isStarting?: boolean;
}

export function ProcessCard({ process, onStart, isStarting }: ProcessCardProps) {
	const lastExecutionTime = process.lastExecutionTime
		? typeof process.lastExecutionTime === 'string'
			? new Date(process.lastExecutionTime)
			: process.lastExecutionTime
		: null;

	return (
		<Card className="hover:shadow-lg transition-shadow duration-200">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg font-semibold">{process.name}</CardTitle>
						<CardDescription className="mt-1">
							{process.description || 'No description available'}
						</CardDescription>
					</div>
					{process.lastExecutionStatus && (
						<JobStatusBadge status={process.lastExecutionStatus} />
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Key className="w-4 h-4" />
						<span className="font-mono text-xs">{process.key}</span>
					</div>
					{lastExecutionTime && (
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>Last run: {format(lastExecutionTime, 'PPp')}</span>
						</div>
					)}
				</div>
			</CardContent>
			{onStart && (
				<CardFooter>
					<Button
						onClick={() => onStart(process.key)}
						disabled={isStarting}
						className="w-full"
						variant="default"
					>
						<Play className="w-4 h-4 mr-2" />
						{isStarting ? 'Starting...' : 'Start Process'}
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
