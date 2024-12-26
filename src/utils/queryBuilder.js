import { addDays, parseISO, startOfDay } from 'date-fns';

export const buildSearchQuery = (query, filters) => {
  const { date, status, search } = filters;

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
    query = query.textSearch('patients.name', search, {
      type: 'websearch',
      config: 'english'
    });
  }

  return query;
};