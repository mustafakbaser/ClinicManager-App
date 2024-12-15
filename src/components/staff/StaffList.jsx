import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Table, Thead, Tbody, Th, Td } from '../ui/Table';
import Button from '../ui/Button';

export default function StaffList({ staff, onEdit, onDelete }) {
  return (
    <Table>
      <Thead>
        <tr>
          <Th>Ad Soyad</Th>
          <Th>Bölüm</Th>
          <Th>Telefon</Th>
          <Th>E-posta</Th>
          <Th>Kayıt Tarihi</Th>
          <Th>İşlemler</Th>
        </tr>
      </Thead>
      <Tbody>
        {staff.map((person) => (
          <tr key={person.id}>
            <Td>{person.name}</Td>
            <Td>{person.department}</Td>
            <Td>{person.phone}</Td>
            <Td>{person.email}</Td>
            <Td>
              {format(new Date(person.created_at), 'dd MMMM yyyy', { locale: tr })}
            </Td>
            <Td>
              <Button
                variant="secondary"
                onClick={() => onEdit(person)}
                className="mr-2"
              >
                Düzenle
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(person.id)}
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