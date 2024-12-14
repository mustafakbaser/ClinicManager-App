import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Table, Thead, Tbody, Th, Td } from '../ui/Table';
import Button from '../ui/Button';

export default function AppointmentList({ appointments, onUpdateStatus, onDelete }) {
  return (
    <Table>
      <Thead>
        <tr>
          <Th>Hasta</Th>
          <Th>Bölüm</Th>
          <Th>Doktor</Th>
          <Th>Tarih</Th>
          <Th>Durum</Th>
          <Th>İşlemler</Th>
        </tr>
      </Thead>
      <Tbody>
        {appointments.map((appointment) => (
          <tr key={appointment.id}>
            <Td>{appointment.patient_name}</Td>
            <Td>{appointment.department_name}</Td>
            <Td>{appointment.doctor_name}</Td>
            <Td>
              {format(new Date(appointment.appointment_date), 'dd MMMM yyyy HH:mm', { locale: tr })}
            </Td>
            <Td>{appointment.status}</Td>
            <Td>
              <Button
                variant="secondary"
                onClick={() => onUpdateStatus(appointment.id, appointment.status)}
                className="mr-2"
              >
                {appointment.status === 'Bekliyor' ? 'Tamamla' : 'Beklet'}
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(appointment.id)}
              >
                Sil
              </Button>
            </Td>
          </tr>
        ))}
      </Tbody>
    </Table>
  );
}