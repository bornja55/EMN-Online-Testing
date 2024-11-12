// middleware/validation.js
const { body, query, param, validationResult } = require('express-validator');

// ฟังก์ชันตรวจสอบผลการ validate
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'ข้อมูลไม่ถูกต้อง',
      errors: errors.array()
    });
  }
  next();
};

// กฎการตรวจสอบสำหรับการลงทะเบียน
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('username ต้องมีความยาว 4-20 ตัวอักษร')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('username ต้องประกอบด้วยตัวอักษร ตัวเลข หรือ _ เท่านั้น'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    .withMessage('รหัสผ่านต้องประกอบด้วยตัวอักษรและตัวเลข'),
  
  validate
];

// กฎการตรวจสอบสำหรับการเข้าสู่ระบบ
const loginValidation = [
  body('email').trim().isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
  body('password').notEmpty().withMessage('กรุณากรอกรหัสผ่าน'),
  validate
];

// กฎการตรวจสอบสำหรับการสร้างข้อสอบ
const questionValidation = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('กรุณากรอกคำถาม')
    .isLength({ max: 1000 })
    .withMessage('คำถามต้องไม่เกิน 1000 ตัวอักษร'),
  
  body('options')
    .isArray({ min: 2, max: 4 })
    .withMessage('ต้องมีตัวเลือก 2-4 ข้อ'),
  
  body('options.*')
    .trim()
    .notEmpty()
    .withMessage('ตัวเลือกต้องไม่เป็นค่าว่าง')
    .isLength({ max: 500 })
    .withMessage('ตัวเลือกต้องไม่เกิน 500 ตัวอักษร'),
  
  body('correctOption')
    .isInt({ min: 0 })
    .withMessage('กรุณาระบุคำตอบที่ถูกต้อง'),
  
  body('subjectId')
    .isMongoId()
    .withMessage('รหัสวิชาไม่ถูกต้อง'),
  
  validate
];

// กฎการตรวจสอบสำหรับการส่งผลสอบ
const quizSubmissionValidation = [
  body('answers')
    .isArray()
    .withMessage('รูปแบบคำตอบไม่ถูกต้อง'),
  
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('รหัสคำถามไม่ถูกต้อง'),
  
  body('answers.*.selectedOption')
    .isInt({ min: 0 })
    .withMessage('คำตอบต้องเป็นตัวเลข'),
  
  validate
];

// กฎการตรวจสอบสำหรับการค้นหา
const searchValidation = [
  query('keyword')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('คำค้นหาต้องมีอย่างน้อย 2 ตัวอักษร'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('หน้าต้องเป็นตัวเลขที่มากกว่า 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('จำนวนรายการต่อหน้าต้องอยู่ระหว่าง 1-100'),
  
  validate
];

// กฎการตรวจสอบ MongoID
const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('รูปแบบ ID ไม่ถูกต้อง'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  questionValidation,
  quizSubmissionValidation,
  searchValidation,
  mongoIdValidation
};
