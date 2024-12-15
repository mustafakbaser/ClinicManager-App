import { ERROR_MESSAGES, STATUS } from '../config/constants';
import { appointmentModel } from '../models/appointment';
import { staffModel } from '../models/staff';
import { getDepartmentByName } from './departmentService';

export const appointmentService = {
  async getAll() {
    try {
      return await appointmentModel.findAll();
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async create({ patientId, doctorId, appointmentDate }) {
    try {
      // Get doctor's information
      const doctor = await staffModel.findById(doctorId);
      if (!doctor) {
        throw new Error('Doktor bulunamadı');
      }

      // Get or create department
      const department = await getDepartmentByName(doctor.department);

      // Create appointment
      return await appointmentModel.create({
        patient_id: patientId,
        doctor_id: doctorId,
        department_id: department.id,
        appointment_date: appointmentDate,
        status: STATUS.PENDING
      });
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async updateStatus(id, status) {
    try {
      return await appointmentModel.updateStatus(id, status);
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  },

  async delete(id) {
    try {
      return await appointmentModel.delete(id);
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.DEFAULT);
    }
  }
};