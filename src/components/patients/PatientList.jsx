import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Table, Thead, Tbody, Th, Td } from '../ui/Table';
import Button from '../ui/Button';
import { formatPhoneNumber } from '../../utils/format';

export default function PatientList({ patients, onEdit, onDelete }) {
  return (
    <Table>
      <Thead>
        <tr>
          <Th>TCKN</Th>
          <Th>Ad Soyad</Th>
          <Th>Telefon</Th>
          <Th>Randevu Sayısı</Th>
          <Th>Son Randevu</Th>
          <Th>Kayıt Tarihi</Th>
          <Th>İşlemler</Th>
        </tr>
      </Thead>
      <Tbody>
        {patients.map((patient) => (
          <tr key={patient.id}>
            <Td className="font-mono">{patient.tckn}</Td>
            <Td>{patient.name}</Td>
            <Td className="font-mono">{formatPhoneNumber(patient.phone)}</Td>
            <Td>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {patient.appointmentCount}
              </span>
            </Td>
            <Td>
              {patient.lastAppointment 
                ? format(new Date(patient.lastAppointment), 'dd MMMM yyyy', { locale: tr })
                : '-'}
            </Td>
            <Td>
              {format(new Date(patient.created_at), 'dd MMMM yyyy', { locale: tr })}
            </Td>
            <Td>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(patient)}
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(patient.id)}
                >
                  Sil
                </Button>
              </div>
            </Td>
          </tr>
        ))}
        {patients.length === 0 && (
          <tr>
            <Td colSpan="7" className="text-center py-8 text-gray-500">
              Hasta kaydı bulunamadı
            </Td>
          </tr>
        )}
      </Tbody>
    </Table>
  );
}