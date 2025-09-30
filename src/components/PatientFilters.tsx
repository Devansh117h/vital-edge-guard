import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/types/health';
import { Search, Filter, X } from 'lucide-react';

interface PatientFiltersProps {
  patients: Patient[];
  onFilteredPatientsChange: (filtered: Patient[]) => void;
}

const PatientFilters: React.FC<PatientFiltersProps> = ({ patients, onFilteredPatientsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');

  // Get unique room numbers for filter
  const uniqueRooms = Array.from(new Set(patients.map(p => p.roomNumber))).sort();

  React.useEffect(() => {
    let filtered = patients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    // Room filter
    if (roomFilter !== 'all') {
      filtered = filtered.filter(patient => patient.roomNumber === roomFilter);
    }

    onFilteredPatientsChange(filtered);
  }, [searchTerm, statusFilter, roomFilter, patients, onFilteredPatientsChange]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRoomFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || roomFilter !== 'all';

  return (
    <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, room, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[150px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Room Filter */}
        <div className="min-w-[150px]">
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {uniqueRooms.map(room => (
                <SelectItem key={room} value={room}>{room}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>
              Active filters: 
              {searchTerm && ` Search: "${searchTerm}"`}
              {statusFilter !== 'all' && ` Status: ${statusFilter}`}
              {roomFilter !== 'all' && ` Room: ${roomFilter}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientFilters;