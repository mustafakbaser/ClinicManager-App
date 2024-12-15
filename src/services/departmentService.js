import { ERROR_MESSAGES } from '../config/constants';
import { departmentModel } from '../models/department';

export const getDepartmentByName = async (name) => {
  try {
    // Try to find existing department
    let department = await departmentModel.findByName(name);

    // Create new department if it doesn't exist
    if (!department) {
      department = await departmentModel.create(name);
    }

    return department;
  } catch (error) {
    throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
  }
};

export const departmentService = {
  // ... rest of the service methods remain the same
};