// utils/constants.js

// ค่าคงที่สำหรับการตั้งค่าระบบ
const SYSTEM_CONFIG = {
    MAX_LOGIN_ATTEMPTS: 5,
    LOGIN_TIMEOUT: 15 * 60 * 1000, // 15 นาที
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 ชั่วโมง
    PASSWORD_SALT_ROUNDS: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf']
  };
  
  // ค่าคงที่สำหรับการกำหนดสิทธิ์
  const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
  };
  
  // ค่าคงที่สำหรับระดับความยาก
  const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
  };
  
  // ค่าคงที่สำหรับประเภทคำถาม
  const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    FILL_IN: 'fill_in'
  };
  
  // ค่าคงที่สำหรับสถานะการสอบ
  const QUIZ_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    EXPIRED: 'expired'
  };

// ค่าคงที่สำหรับการแจ้งเตือน
const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error'
  };
  
  // ค่าคงที่สำหรับการตั้งค่าการสอบ
  const QUIZ_CONFIG = {
    MIN_QUESTIONS: 5,
    MAX_QUESTIONS: 50,
    DEFAULT_TIME_LIMIT: 60, // นาที
    MIN_PASS_SCORE: 60, // เปอร์เซ็นต์
  };
  
  // ค่าคงที่สำหรับ API endpoints
  const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      RESET_PASSWORD: '/api/auth/reset-password'
    },
    USER: {
      PROFILE: '/api/user/profile',
      UPDATE: '/api/user/update',
      DELETE: '/api/user/delete'
    },
    QUIZ: {
      CREATE: '/api/quiz/create',
      START: '/api/quiz/start',
      SUBMIT: '/api/quiz/submit',
      RESULTS: '/api/quiz/results'
    }
  };

// ค่าคงที่สำหรับข้อความ Error
const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
    ACCOUNT_LOCKED: 'บัญชีถูกล็อค กรุณาลองใหม่ภายหลัง',
    SESSION_EXPIRED: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',
    UNAUTHORIZED: 'ไม่มีสิทธิ์ในการเข้าถึง',
    NOT_FOUND: 'ไม่พบข้อมูลที่ร้องขอ',
    SERVER_ERROR: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์'
  };
  
  module.exports = {
    SYSTEM_CONFIG,
    USER_ROLES,
    DIFFICULTY_LEVELS,
    QUESTION_TYPES,
    QUIZ_STATUS,
    NOTIFICATION_TYPES,
    QUIZ_CONFIG,
    API_ENDPOINTS,
    ERROR_MESSAGES
  };
      