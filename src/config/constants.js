// Table Names
export const TABLES = {
  DEPARTMENTS: 'departments',
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  STAFF: 'staff'
};

// Status Types
export const STATUS = {
  PENDING: 'Bekliyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal',
};

// Appointments only store a start time; each one is treated as a slot of this
// length when checking a doctor's availability. The database constraint uses the
// same length (appointment_slot() in migrations/001), so change both together
export const APPOINTMENT_DURATION_MINUTES = 30;

// Error Messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  NETWORK: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  NOT_FOUND: 'İstenilen kayıt bulunamadı.',
  UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır.',
  DUPLICATE_TCKN: 'Bu TCKN numarası ile kayıtlı bir hasta bulunmaktadır.',
  INVALID_EMAIL: 'Geçersiz e-posta adresi.',
  INVALID_PHONE: 'Geçersiz telefon numarası.',
  REQUIRED_FIELD: 'Bu alan zorunludur.',
  APPOINTMENT_CONFLICT: 'Seçilen doktorun bu saatte başka bir randevusu bulunmaktadır. Lütfen farklı bir saat seçin.',
};