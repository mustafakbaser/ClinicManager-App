import { isSameDay, parseISO } from 'date-fns';

export const buildAppointmentQuery = (query, filters) => {
  const { date, status, search } = filters;

  if (date) {
    query = query.filter('appointment_date', 'gte', `${date}T00:00:00`)
                 .filter('appointment_date', 'lt', `${date}T23:59:59`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.textSearch('patients.name', search, {
      type: 'websearch',
      config: 'english'
    });
  }

  return query;
};