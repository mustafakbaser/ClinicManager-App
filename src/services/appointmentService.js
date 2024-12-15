import { ERROR_MESSAGES, STATUS } from '../config/constants';
import { appointmentModel } from '../models/appointment';
import { staffModel } from '../models/staff';
import { getDepartmentByName } from './departmentService';

export const appointmentService = {
  async getAll(filters = {}) {
    try {
      return await appointmentModel.findAll(filters);
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  // ... rest of the code remains the same
};