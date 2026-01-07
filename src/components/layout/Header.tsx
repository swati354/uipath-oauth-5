import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Folder } from 'lucide-react';
interface HeaderProps {
  selectedFolder?: number;
  onFolderChange: (folderId: number | undefined) => void;
}
export function Header({ selectedFolder, onFolderChange }: HeaderProps) {
  // Mock folder data - in a real app, this would come from UiPath API
  const folders = [
    { id: undefined, name: 'All Folders', description: 'Show processes from all folders' },
    { id: 1, name: 'Default', description: 'Default folder' },
    { id: 2, name: 'Production', description: 'Production processes' },
    { id: 3, name: 'Development', description: 'Development processes' },
  ];
  return (
    <header className="space-y-6">
      {/* Main Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              UiPath Process Explorer
            </h1>
            <p className="text-muted-foreground">
              View, manage, and execute automation processes from UiPath Orchestrator
            </p>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Folder Selector */}
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Folder:</span>
            <Select
              value={selectedFolder?.toString() || 'all'}
              onValueChange={(value) => 
                onFolderChange(value === 'all' ? undefined : parseInt(value))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem 
                    key={folder.id || 'all'} 
                    value={folder.id?.toString() || 'all'}
                  >
                    <div className="flex items-center gap-2">
                      <span>{folder.name}</span>
                      {folder.id === undefined && (
                        <Badge variant="secondary" className="text-xs">
                          All
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Connected to UiPath Orchestrator
          </div>
        </div>
      </div>
    </header>
  );
}