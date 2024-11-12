// controllers/quizResultController.js

const QuizResult = require('../models/QuizResult');

// ฟังก์ชันบันทึกผลการทดสอบ
exports.saveQuizResult = async (req, res) => {
  try {
    const { userId, subjectId, score, totalQuestions, answers } = req.body;
    const newResult = new QuizResult({
      userId,
      subjectId,
      score,
      totalQuestions,
      answers,
    });

    await newResult.save();
    res.status(201).json({ message: 'ผลการทดสอบถูกบันทึกเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกผลการทดสอบ', error });
  }
};

// ฟังก์ชันดึงข้อมูลประวัติการสอบตาม userId
exports.getUserQuizResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId }).populate('subjectId', 'name grade').exec();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการสอบ', error });
  }
};

// ฟังก์ชันคำนวณและบันทึกผลการทดสอบ (ฟังก์ชันใหม่ที่เพิ่มเข้ามา)
exports.calculateAndSaveQuizResult = async (req, res) => {
  try {
    const { userId, subjectId, answers } = req.body;
    let score = 0;
    const totalQuestions = answers.length;
    const answerResults = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (question) {
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) score += 1;

        answerResults.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: isCorrect,
        });
      }
    }

    const newResult = new QuizResult({
      userId,
      subjectId,
      score,
      totalQuestions,
      answers: answerResults,
    });

    await newResult.save();
    res.status(201).json({
      message: 'ผลการทดสอบถูกคำนวณและบันทึกเรียบร้อยแล้ว',
      score: score,
      totalQuestions: totalQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการคำนวณและบันทึกผลการทดสอบ', error });
  }
};

// ฟังก์ชันวิเคราะห์ผลสอบ
exports.analyzeQuizResults = async (req, res) => {
  try {
    const { userId } = req.params;

    // คำนวณค่าเฉลี่ยคะแนนของผู้ใช้ตาม subjectId
    const averageScores = await QuizResult.aggregate([
      { $match: { userId: userId } },          // กรองตาม userId
      {
        $group: {
          _id: '$subjectId',                    // จัดกลุ่มตาม subjectId
          averageScore: { $avg: '$score' },     // คำนวณค่าเฉลี่ยคะแนน
          totalExams: { $sum: 1 },              // จำนวนการสอบทั้งหมดในวิชานั้น ๆ
        }
      }
    ]);

    // ดึงค่าเฉลี่ยความสำเร็จในการตอบคำถามแต่ละข้อ
    const questionSuccessRate = await QuizResult.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$answers' },                  // แตก array answers ออกเป็นข้อมูลแยก
      {
        $group: {
          _id: '$answers.questionId',           // จัดกลุ่มตาม questionId
          successRate: { $avg: { $cond: ['$answers.isCorrect', 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      averageScores: averageScores,
      questionSuccessRate: questionSuccessRate
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการวิเคราะห์ผลการสอบ', error });
  }
};

// ฟังก์ชันวิเคราะห์คะแนนเฉลี่ยและคะแนนสูงสุดของผู้ใช้
exports.analyzeUserQuizResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId });

    if (results.length === 0) {
      return res.status(404).json({ message: 'ไม่พบผลการสอบสำหรับผู้ใช้ที่ระบุ' });
    }

    // คำนวณคะแนนรวม
    const totalScores = results.reduce((sum, result) => sum + result.score, 0);
    
    // คำนวณคะแนนเฉลี่ย
    const averageScore = totalScores / results.length;

    // คำนวณคะแนนสูงสุด
    const highestScore = Math.max(...results.map(result => result.score));

    res.status(200).json({
      averageScore: averageScore,
      highestScore: highestScore,
      totalExams: results.length,
    });
  } catch (error) {
    console.error('Error analyzing quiz results:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการวิเคราะห์ผลการสอบ', error });
  }
};

