// middleware/errorHandler.js
const mongoose = require('mongoose');

// ประเภทของ Error ที่เราจะจัดการ
const ERROR_TYPES = {
  VALIDATION: 'ValidationError',
  DUPLICATE: 'DuplicateError',
  AUTHENTICATION: 'AuthenticationError',
  AUTHORIZATION: 'AuthorizationError',
  NOT_FOUND: 'NotFoundError',
  RATE_LIMIT: 'RateLimitError'
};

// ฟังก์ชันจัดการ Error ทั้งหมด
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // จัดการ Error ตามประเภท
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      type: ERROR_TYPES.VALIDATION,
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // จัดการ MongoDB Duplicate Key Error
  if (err.code === 11000) {
    return res.status(400).json({
      type: ERROR_TYPES.DUPLICATE,
      message: 'ข้อมูลซ้ำ',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // จัดการ Authentication Error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      type: ERROR_TYPES.AUTHENTICATION,
      message: 'การยืนยันตัวตนล้มเหลว',
      detail: err.message
    });
  }

  // จัดการ Authorization Error
  if (err.name === 'UnauthorizedError') {
    return res.status(403).json({
      type: ERROR_TYPES.AUTHORIZATION,
      message: 'ไม่มีสิทธิ์ในการดำเนินการนี้'
    });
  }

  // จัดการ Not Found Error
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      type: ERROR_TYPES.NOT_FOUND,
      message: 'ไม่พบข้อมูลที่ร้องขอ',
      resource: err.resource
    });
  }

  // จัดการ Rate Limit Error
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      type: ERROR_TYPES.RATE_LIMIT,
      message: 'คำขอมากเกินไป กรุณาลองใหม่ภายหลัง',
      retryAfter: err.retryAfter
    });
  }

  // Error ที่ไม่ได้คาดการณ์
  return res.status(500).json({
    message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่ภายหลัง',
    errorId: req.id // ถ้ามีการใช้ request ID
  });
};

// Custom Error Classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.VALIDATION;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.AUTHENTICATION;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = ERROR_TYPES.AUTHORIZATION;
  }
}

class NotFoundError extends Error {
    constructor(message, resource) {
      super(message);
      this.name = ERROR_TYPES.NOT_FOUND;
      this.resource = resource;
    }
  }
  
  class RateLimitError extends Error {
    constructor(message, retryAfter) {
      super(message);
      this.name = ERROR_TYPES.RATE_LIMIT;
      this.retryAfter = retryAfter;
    }
  }
  
  // ฟังก์ชันจัดการ Async Error
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  // ฟังก์ชันบันทึก Error
  const logError = (err, req) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: err.name,
      message: err.message,
      stack: err.stack,
      requestId: req.id,
      user: req.user ? req.user.id : 'anonymous',
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    };

  // บันทึกลง console (ในการพัฒนา)
  console.error('Error Log:', errorLog);

  // TODO: บันทึกลงฐานข้อมูลหรือส่งไปยังระบบ logging
};

module.exports = {
  errorHandler,
  asyncHandler,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  ERROR_TYPES,
  logError
};

  