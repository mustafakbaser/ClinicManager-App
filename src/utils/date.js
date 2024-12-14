import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export const formatDate = (date, formatStr = 'dd MMMM yyyy') => {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, formatStr, { locale: tr });
};

export const formatDateTime = (date) => {
  return formatDate(date, 'dd MMMM yyyy HH:mm');
};

export const toISOString = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};