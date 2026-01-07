import { useState, useRef } from 'react';
import type { ProcessGetResponse } from 'uipath-sdk';
export function useProcessFilters() {
  const [searchText, setSearchText] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'inactive'>('all');
  // Use ref to store filtered processes to avoid re-renders
  const filteredProcesses = useRef<ProcessGetResponse[]>([]);
  return {
    searchText,
    selectedFolder,
    statusFilter,
    filteredProcesses,
    setSearchText,
    setSelectedFolder,
    setStatusFilter,
  };
}