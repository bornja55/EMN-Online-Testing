// routes/quizResultRoutes.js

const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResultController');

// เส้นทางสำหรับบันทึกผลการทดสอบ
router.post('/save', quizResultController.saveQuizResult);

// เส้นทางสำหรับคำนวณและบันทึกผลการทดสอบ
router.post('/calculate-save', quizResultController.calculateAndSaveQuizResult);

// เส้นทางสำหรับดึงประวัติการสอบตาม userId
router.get('/:userId', quizResultController.getUserQuizResults);

// เส้นทางสำหรับวิเคราะห์ผลการสอบ
router.get('/analyze/:userId', quizResultController.analyzeQuizResults);

// เส้นทางสำหรับวิเคราะห์คะแนนเฉลี่ยและคะแนนสูงสุดของผู้ใช้
router.get('/user-analysis/:userId', quizResultController.analyzeUserQuizResults);

module.exports = router;
