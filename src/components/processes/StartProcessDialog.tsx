import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Package, User, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { ProcessGetResponse } from 'uipath-sdk';
interface StartProcessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  process: ProcessGetResponse | null;
  isLoading: boolean;
}
export function StartProcessDialog({
  isOpen,
  onClose,
  onConfirm,
  process,
  isLoading
}: StartProcessDialogProps) {
  if (!process) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Start Process
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to start this process? It will be executed immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Process Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1 flex-1">
                <div className="font-medium text-foreground">
                  {process.name || 'Unnamed Process'}
                </div>
                {process.description && (
                  <div className="text-sm text-muted-foreground">
                    {process.description}
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Author</span>
                </div>
                <div className="font-medium">
                  {process.author || 'Unknown'}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Version</span>
                </div>
                <Badge variant="outline" className="font-mono text-xs w-fit">
                  {process.processVersion || '1.0.0'}
                </Badge>
              </div>
            </div>
            {process.creationTime && (
              <>
                <Separator />
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Created</div>
                  <div className="font-medium">
                    {format(new Date(process.creationTime), 'PPP')}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Execution Strategy Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">Execution Strategy</div>
              <div className="text-muted-foreground">
                The process will be started with the default execution strategy on available robots.
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Process
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}