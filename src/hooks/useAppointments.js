import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';

export const useAppointments = (filters = {}) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentService.getAll(filters),
    keepPreviousData: true
  });
};