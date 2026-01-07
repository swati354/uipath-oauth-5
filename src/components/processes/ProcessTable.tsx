import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessStatusBadge } from './ProcessStatusBadge';
import { 
  Play, 
  ChevronUp, 
  ChevronDown, 
  Package, 
  Calendar,
  User,
  Folder
} from 'lucide-react';
import { format } from 'date-fns';
import type { ProcessGetResponse } from 'uipath-sdk';
interface ProcessTableProps {
  processes: ProcessGetResponse[];
  isLoading: boolean;
  onStartProcess: (process: ProcessGetResponse) => void;
  isStartingProcess: boolean;
}
type SortField = 'name' | 'version' | 'creationTime' | 'isActive';
type SortDirection = 'asc' | 'desc';
export function ProcessTable({ 
  processes, 
  isLoading, 
  onStartProcess, 
  isStartingProcess 
}: ProcessTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sortedProcesses = useMemo(() => {
    if (!processes) return [];
    return [...processes].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      // Handle different data types
      if (sortField === 'creationTime') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      } else if (typeof aValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [processes, sortField, sortDirection]);
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="h-3 w-3" /> : 
            <ChevronDown className="h-3 w-3" />
        )}
      </span>
    </Button>
  );
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Processes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-muted animate-pulse rounded flex-1" />
                <div className="h-4 bg-muted animate-pulse rounded w-20" />
                <div className="h-4 bg-muted animate-pulse rounded w-16" />
                <div className="h-8 bg-muted animate-pulse rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!processes || processes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Processes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No processes found</h3>
            <p className="text-muted-foreground">
              No processes are available in the selected folder. Create processes in UiPath Studio and publish them to Orchestrator to see them here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Processes ({processes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">
                  <SortButton field="name">Process Name</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="version">Version</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="isActive">Status</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="creationTime">Created</SortButton>
                </TableHead>
                <TableHead>Environment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProcesses.map((process) => (
                <TableRow key={process.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {process.name || 'Unnamed Process'}
                      </div>
                      {process.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {process.description}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {process.author || 'Unknown'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {process.processVersion || '1.0.0'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ProcessStatusBadge 
                      isActive={process.isActive}
                      isLatestVersion={process.isLatestVersion}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {process.creationTime ? 
                        format(new Date(process.creationTime), 'MMM d, yyyy') : 
                        'Unknown'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Folder className="h-3 w-3" />
                      {process.environmentName || 'Default'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => onStartProcess(process)}
                      disabled={!process.isActive || isStartingProcess}
                      className="gap-2"
                    >
                      <Play className="h-3 w-3" />
                      Start
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}