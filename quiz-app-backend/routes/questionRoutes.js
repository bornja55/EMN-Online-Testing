// routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isTeacher } = require('../middleware/auth');
const { mongoIdValidation } = require('../middleware/validation');

// ตรวจสอบข้อมูลวิชา
const subjectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('กรุณากรอกชื่อวิชา')
    .isLength({ max: 100 })
    .withMessage('ชื่อวิชาต้องไม่เกิน 100 ตัวอักษร'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('คำอธิบายต้องไม่เกิน 500 ตัวอักษร'),
  
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('ระดับต้องเป็น beginner, intermediate หรือ advanced'),
  
  validate
];

// ดึงรายการวิชาทั้งหมด
router.get('/', verifyToken, async (req, res) => {
    try {
      const subjects = await Subject.find()
        .select('name description level questionCount')
        .sort({ name: 1 });
      
      res.json(subjects);
    } catch (error) {
      next(error);
    }
  });
  
  // ดึงข้อมูลวิชาตาม ID
  router.get('/:id', verifyToken, mongoIdValidation, async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.id);
      if (!subject) {
        throw new NotFoundError('ไม่พบวิชาที่ระบุ', 'Subject');
      }
      res.json(subject);
    } catch (error) {
      next(error);
    }
  });

// สร้างวิชาใหม่
router.post('/', verifyToken, isTeacher, subjectValidation, async (req, res) => {
    try {
      const { name, description, level } = req.body;
      
      const subject = new Subject({
        name,
        description,
        level,
        createdBy: req.user.id
      });
      
      await subject.save();
      res.status(201).json({
        message: 'สร้างวิชาเรียบร้อยแล้ว',
        subject
      });
    } catch (error) {
      next(error);
    }
  });

// อัพเดทข้อมูลวิชา
router.put('/:id', verifyToken, isTeacher, mongoIdValidation, subjectValidation, async (req, res) => {
    try {
      const { name, description, level } = req.body;
      
      const subject = await Subject.findById(req.params.id);
      if (!subject) {
        throw new NotFoundError('ไม่พบวิชาที่ระบุ', 'Subject');
      }
      
      // ตรวจสอบสิทธิ์
      if (subject.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
        throw new AuthorizationError('ไม่มีสิทธิ์แก้ไขวิชานี้');
      }
      
      subject.name = name;
      subject.description = description;
      subject.level = level;
      subject.updatedAt = Date.now();
      
      await subject.save();
      res.json({
        message: 'อัพเดทวิชาเรียบร้อยแล้ว',
        subject
      });
    } catch (error) {
      next(error);
    }
});

// ลบวิชา
router.delete('/:id', verifyToken, isAdmin, mongoIdValidation, async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.id);
      if (!subject) {
        throw new NotFoundError('ไม่พบวิชาที่ระบุ', 'Subject');
      }
      
      // ตรวจสอบว่ามีข้อสอบในวิชานี้หรือไม่
      const questionCount = await Question.countDocuments({ subjectId: req.params.id });
      if (questionCount > 0) {
        throw new ValidationError('ไม่สามารถลบวิชาที่มีข้อสอบได้');
      }
      
      await subject.remove();
      res.json({
        message: 'ลบวิชาเรียบร้อยแล้ว'
      });
    } catch (error) {
      next(error);
    }
});

// ดึงสถิติของวิชา
router.get('/:id/stats', verifyToken, mongoIdValidation, async (req, res) => {
    try {
      const subject = await Subject.findById(req.params.id);
      if (!subject) {
        throw new NotFoundError('ไม่พบวิชาที่ระบุ', 'Subject');
      }
      
      const stats = await QuizResult.aggregate([
        { $match: { subjectId: subject._id } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: '$score' },
            highestScore: { $max: '$score' },
            lowestScore: { $min: '$score' }
          }
        }
      ]);
      
      res.json({
        subject: {
          name: subject.name,
          questionCount: await Question.countDocuments({ subjectId: subject._id })
        },
        stats: stats[0] || {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0
        }
      });
    } catch (error) {
      next(error);
    }
});
  
module.exports = router;
  