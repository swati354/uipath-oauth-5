/**
 * QueueMonitor Component
 *
 * Displays queue status with item counts and status distribution
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';

interface QueueMonitorProps {
	queue: {
		id: string;
		name: string;
		description?: string;
		itemCounts?: {
			new?: number;
			inProgress?: number;
			failed?: number;
			successful?: number;
		};
	};
	onClick?: () => void;
}

export function QueueMonitor({ queue, onClick }: QueueMonitorProps) {
	const counts = queue.itemCounts || {
		new: 0,
		inProgress: 0,
		failed: 0,
		successful: 0,
	};

	const total = counts.new! + counts.inProgress! + counts.failed! + counts.successful!;
	const successRate = total > 0 ? ((counts.successful! / total) * 100).toFixed(1) : '0';

	return (
		<Card
			className={`hover:shadow-lg transition-shadow duration-200 ${onClick ? 'cursor-pointer' : ''}`}
			onClick={onClick}
		>
			<CardHeader>
				<CardTitle className="text-lg font-semibold">{queue.name}</CardTitle>
				<CardDescription>{queue.description || 'Queue monitoring'}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Item count summary */}
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-yellow-500" />
							<div>
								<p className="text-2xl font-bold">{counts.new}</p>
								<p className="text-xs text-muted-foreground">New</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
							<div>
								<p className="text-2xl font-bold">{counts.inProgress}</p>
								<p className="text-xs text-muted-foreground">In Progress</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle2 className="w-4 h-4 text-green-500" />
							<div>
								<p className="text-2xl font-bold">{counts.successful}</p>
								<p className="text-xs text-muted-foreground">Successful</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<XCircle className="w-4 h-4 text-red-500" />
							<div>
								<p className="text-2xl font-bold">{counts.failed}</p>
								<p className="text-xs text-muted-foreground">Failed</p>
							</div>
						</div>
					</div>

					{/* Success rate progress bar */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Success Rate</span>
							<span className="font-semibold">{successRate}%</span>
						</div>
						<Progress value={parseFloat(successRate)} className="h-2" />
					</div>

					{/* Total items */}
					<div className="text-center text-sm text-muted-foreground">
						Total Items: {total}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
