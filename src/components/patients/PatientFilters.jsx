import React from 'react';
import Input from '../form/Input';
import Card from '../ui/Card';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function PatientFilters({ filters, onFilterChange }) {
  return (
    <Card className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Ad veya TCKN ile ara..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-10"
        />
      </div>
    </Card>
  );
}