// Table Names
export const TABLES = {
  DEPARTMENTS: 'departments',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  STAFF: 'staff'
};

// Status Types
export const STATUS = {
  PENDING: 'Bekliyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal',
};

// Error Messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  NETWORK: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
  NOT_FOUND: 'İstenilen kayıt bulunamadı.',
  UNAUTHORIZED: 'Bu işlem için yetkiniz bulunmamaktadır.',
  DUPLICATE_TCKN: 'Bu TCKN numarası ile kayıtlı bir hasta bulunmaktadır.',
};