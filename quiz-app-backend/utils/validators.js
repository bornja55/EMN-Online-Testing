// utils/validators.js

// ตรวจสอบความถูกต้องของอีเมล
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ตรวจสอบความซับซ้อนของรหัสผ่าน
const isStrongPassword = (password) => {
  // ต้องมีความยาวอย่างน้อย 8 ตัว
  // ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
  // ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว
  // ต้องมีตัวเลขอย่างน้อย 1 ตัว
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// ตรวจสอบความถูกต้องของชื่อผู้ใช้
const isValidUsername = (username) => {
  // ต้องมีความยาว 3-20 ตัว
  // ต้องขึ้นต้นด้วยตัวอักษร
  // อนุญาตให้ใช้ตัวอักษร ตัวเลข และ _ เท่านั้น
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
  return usernameRegex.test(username);
};

// ตรวจสอบความถูกต้องของ MongoDB ObjectId
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// ตรวจสอบความถูกต้องของ URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ตรวจสอบความถูกต้องของวันที่
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// ตรวจสอบข้อความว่าง
const isEmpty = (value) => {
  return value === null || value === undefined || value.trim() === '';
};

// ตรวจสอบความยาวของข้อความ
const isValidLength = (text, min, max) => {
  const length = text.trim().length;
  return length >= min && length <= max;
};

// ตรวจสอบประเภทไฟล์
const isValidFileType = (filename, allowedTypes) => {
  const extension = filename.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// ตรวจสอบขนาดไฟล์ (ในหน่วย bytes)
const isValidFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize;
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  isValidObjectId,
  isValidUrl,
  isValidDate,
  isEmpty,
  isValidLength,
  isValidFileType,
  isValidFileSize
};
