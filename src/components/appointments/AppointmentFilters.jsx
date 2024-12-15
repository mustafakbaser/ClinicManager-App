import React from 'react';
import Select from '../form/Select';
import Input from '../form/Input';

export default function AppointmentFilters({ filters, onFilterChange }) {
  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'Bekliyor', label: 'Bekliyor' },
    { value: 'Tamamlandı', label: 'Tamamlandı' },
    { value: 'İptal', label: 'İptal' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="date"
          label="Tarih"
          value={filters.date || ''}
          onChange={(e) => onFilterChange('date', e.target.value)}
        />
        <Select
          label="Durum"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
        />
        <Input
          type="text"
          label="Hasta Ara"
          placeholder="Ad veya TCKN ile ara..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
    </div>
  );
}