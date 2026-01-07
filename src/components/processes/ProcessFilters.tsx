import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
interface ProcessFiltersProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  statusFilter: 'all' | 'available' | 'inactive';
  onStatusFilterChange: (filter: 'all' | 'available' | 'inactive') => void;
}
export function ProcessFilters({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: ProcessFiltersProps) {
  const statusOptions = [
    { value: 'all' as const, label: 'All Processes', count: null },
    { value: 'available' as const, label: 'Available', count: null },
    { value: 'inactive' as const, label: 'Inactive', count: null }
  ];
  const hasActiveFilters = searchText || statusFilter !== 'all';
  const clearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
  };
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search processes by name or description..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchText && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearchChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {/* Status Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Status:</span>
        </div>
        <div className="flex items-center gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusFilterChange(option.value)}
              className="h-8"
            >
              {option.label}
            </Button>
          ))}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {searchText && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchText}"
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => onSearchChange('')}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => onStatusFilterChange('all')}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}