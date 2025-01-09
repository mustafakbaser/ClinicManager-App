import { addDays, parseISO, startOfDay } from 'date-fns';

// Drops characters that would break the quoted PostgREST filter value or act as
// LIKE wildcards, so the search term is always matched literally
export const getSearchTerm = (search) => (search || '').replace(/["\\*%_]/g, '').trim();

// Patient search needs the patients relation embedded as an inner join
// (appointmentQueries.withPatientFilter), otherwise PostgREST only filters the
// embedded patient and still returns every appointment
export const buildSearchQuery = (query, filters) => {
  const { date, status } = filters;
  const search = getSearchTerm(filters.search);

  if (date) {
    // `date` is a local calendar day (yyyy-MM-dd); filter by that day's
    // boundaries in the user's timezone
    const dayStart = startOfDay(parseISO(date));
    query = query.gte('appointment_date', dayStart.toISOString())
                 .lt('appointment_date', addDays(dayStart, 1).toISOString());
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (search) {
    query = query.or(
      `name.ilike."*${search}*",tckn.ilike."${search}*"`,
      { referencedTable: 'patients' }
    );
  }

  return query;
};