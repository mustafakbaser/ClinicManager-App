import { useQuery } from '@tanstack/react-query';
import { patientService } from '../services/patientService';

export const usePatients = (filters = {}) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => patientService.getAll(filters),
    keepPreviousData: true
  });
};