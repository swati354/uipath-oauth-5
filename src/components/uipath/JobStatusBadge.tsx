/**
 * JobStatusBadge Component
 *
 * Color-coded badge for displaying UiPath job/execution status
 */

import { Badge } from '../ui/badge';
import { CheckCircle2, XCircle, Loader2, StopCircle, AlertCircle } from 'lucide-react';

export type JobStatus = 'Running' | 'Successful' | 'Failed' | 'Faulted' | 'Stopped' | 'Pending';

interface JobStatusBadgeProps {
	status: JobStatus;
	className?: string;
}

const statusConfig: Record<
	JobStatus,
	{
		label: string;
		variant: 'default' | 'secondary' | 'destructive' | 'outline';
		icon: React.ComponentType<{ className?: string }>;
		className: string;
	}
> = {
	Running: {
		label: 'Running',
		variant: 'default',
		icon: Loader2,
		className: 'bg-blue-500 hover:bg-blue-600 text-white',
	},
	Successful: {
		label: 'Successful',
		variant: 'default',
		icon: CheckCircle2,
		className: 'bg-green-500 hover:bg-green-600 text-white',
	},
	Failed: {
		label: 'Failed',
		variant: 'destructive',
		icon: XCircle,
		className: 'bg-red-500 hover:bg-red-600 text-white',
	},
	Faulted: {
		label: 'Faulted',
		variant: 'default',
		icon: AlertCircle,
		className: 'bg-orange-500 hover:bg-orange-600 text-white',
	},
	Stopped: {
		label: 'Stopped',
		variant: 'secondary',
		icon: StopCircle,
		className: 'bg-gray-500 hover:bg-gray-600 text-white',
	},
	Pending: {
		label: 'Pending',
		variant: 'outline',
		icon: Loader2,
		className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
	},
};

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
	const config = statusConfig[status];
	const Icon = config.icon;

	return (
		<Badge variant={config.variant} className={`${config.className} ${className || ''}`}>
			<Icon className={`w-3 h-3 mr-1 ${status === 'Running' || status === 'Pending' ? 'animate-spin' : ''}`} />
			{config.label}
		</Badge>
	);
}
