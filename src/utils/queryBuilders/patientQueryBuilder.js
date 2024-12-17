/**
 * Build search query for patients based on filters
 */
export const buildPatientSearchQuery = (query, filters) => {
  const { search } = filters;

  if (search) {
    return query.or(`name.ilike.%${search}%,tckn.eq.${search}`);
  }

  return query;
};