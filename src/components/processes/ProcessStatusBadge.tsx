import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
interface ProcessStatusBadgeProps {
  isActive?: boolean;
  isLatestVersion?: boolean;
}
export function ProcessStatusBadge({ isActive, isLatestVersion }: ProcessStatusBadgeProps) {
  if (isActive) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
        <CheckCircle className="h-3 w-3" />
        Available
      </Badge>
    );
  }
  if (isLatestVersion === false) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 gap-1">
        <Clock className="h-3 w-3" />
        Outdated
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100 gap-1">
      <XCircle className="h-3 w-3" />
      Inactive
    </Badge>
  );
}