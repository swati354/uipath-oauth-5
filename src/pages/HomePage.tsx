import React, { useState, useEffect } from 'react';
import { initializeUiPathSDK } from '@/lib/uipath';
import { Header } from '@/components/layout/Header';
import { ProcessTable } from '@/components/processes/ProcessTable';
import { ProcessFilters } from '@/components/processes/ProcessFilters';
import { StartProcessDialog } from '@/components/processes/StartProcessDialog';
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { useProcessFilters } from '@/hooks/useProcessFilters';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { Toaster } from 'sonner';
import type { ProcessGetResponse } from 'uipath-sdk';
export function HomePage() {
  const [isSDKInitialized, setIsSDKInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<ProcessGetResponse | null>(null);
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);
  const {
    searchText,
    selectedFolder,
    statusFilter,
    setSearchText,
    setSelectedFolder,
    setStatusFilter,
    filteredProcesses
  } = useProcessFilters();
  const { data: processes, isLoading, error, refetch } = useUiPathProcesses(
    selectedFolder,
    isSDKInitialized
  );
  const startProcessMutation = useStartProcess();
  // Initialize UiPath SDK on component mount
  useEffect(() => {
    const initSDK = async () => {
      try {
        console.log('🚀 Initializing UiPath SDK...');
        await initializeUiPathSDK();
        setIsSDKInitialized(true);
        setInitError(null);
        console.log('✅ UiPath SDK initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize UiPath SDK:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize UiPath SDK');
      }
    };
    initSDK();
  }, []);
  // Update filtered processes when data changes
  useEffect(() => {
    if (processes) {
      filteredProcesses.current = processes.filter(process => {
        const matchesSearch = !searchText || 
          process.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          process.description?.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'available' && process.isActive) ||
          (statusFilter === 'inactive' && !process.isActive);
        return matchesSearch && matchesStatus;
      });
    }
  }, [processes, searchText, statusFilter, filteredProcesses]);
  const handleStartProcess = (process: ProcessGetResponse) => {
    setSelectedProcess(process);
    setIsStartDialogOpen(true);
  };
  const handleConfirmStart = async () => {
    if (!selectedProcess) return;
    try {
      await startProcessMutation.mutateAsync({
        processKey: selectedProcess.key,
        folderId: selectedFolder || 1
      });
      setIsStartDialogOpen(false);
      setSelectedProcess(null);
      refetch();
    } catch (error) {
      console.error('Failed to start process:', error);
    }
  };
  // Show initialization loading state
  if (!isSDKInitialized && !initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Initializing UiPath Connection</h2>
            <p className="text-sm text-muted-foreground">
              Connecting to UiPath Orchestrator...
            </p>
          </div>
        </div>
      </div>
    );
  }
  // Show initialization error
  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <p className="font-medium">Failed to connect to UiPath Orchestrator</p>
                <p className="text-sm">{initError}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Please check your .env configuration and ensure your UiPath credentials are correct.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <Header 
            selectedFolder={selectedFolder}
            onFolderChange={setSelectedFolder}
          />
          {/* Filters */}
          <div className="mt-8">
            <ProcessFilters
              searchText={searchText}
              onSearchChange={setSearchText}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
          {/* Main Content */}
          <div className="mt-8">
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load processes: {error.message}
                </AlertDescription>
              </Alert>
            ) : (
              <ProcessTable
                processes={filteredProcesses.current || []}
                isLoading={isLoading}
                onStartProcess={handleStartProcess}
                isStartingProcess={startProcessMutation.isPending}
              />
            )}
          </div>
          {/* Start Process Dialog */}
          <StartProcessDialog
            isOpen={isStartDialogOpen}
            onClose={() => {
              setIsStartDialogOpen(false);
              setSelectedProcess(null);
            }}
            onConfirm={handleConfirmStart}
            process={selectedProcess}
            isLoading={startProcessMutation.isPending}
          />
          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © Powered by UiPath
          </footer>
        </div>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}