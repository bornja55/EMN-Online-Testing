// controllers/examController.js
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');

// สร้างการสอบใหม่
exports.createExam = async (req, res) => {
  try {
    const { 
      title, 
      subjectId, 
      duration, 
      totalQuestions,
      difficulty,
      startDate,
      endDate,
      description 
    } = req.body;

    // สุ่มคำถามตามจำนวนที่กำหนด
    const questions = await Question.aggregate([
      { 
        $match: { 
          subjectId, 
          difficulty,
          isActive: true 
        } 
      },
      { $sample: { size: parseInt(totalQuestions) } }
    ]);

    if (questions.length < totalQuestions) {
      return res.status(400).json({ 
        message: 'จำนวนคำถามไม่เพียงพอสำหรับการสร้างแบบทดสอบ' 
      });
    }

    const newExam = new Exam({
      title,
      subjectId,
      questions: questions.map(q => q._id),
      duration,
      totalQuestions,
      difficulty,
      startDate,
      endDate,
      description,
      createdBy: req.user.id
    });

    await newExam.save();
    res.status(201).json({ 
      message: 'สร้างการสอบสำเร็จ', 
      exam: newExam 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการสร้างการสอบ', 
      error 
    });
  }
};

// ดึงข้อมูลการสอบที่พร้อมสอบ
exports.getAvailableExams = async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      isActive: true
    })
    .populate('subjectId', 'name grade')
    .select('-questions'); // ไม่ส่งข้อมูลคำถามกลับไป

    res.json(exams);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการสอบ', 
      error 
    });
  }
};

// เริ่มทำการสอบ
exports.startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId)
      .populate('questions', 'content options'); // ไม่ส่ง correctAnswer กลับไป

    if (!exam) {
      return res.status(404).json({ message: 'ไม่พบการสอบที่ระบุ' });
    }

    // ตรวจสอบว่าผู้ใช้เคยทำข้อสอบนี้แล้วหรือไม่
    const existingResult = await QuizResult.findOne({
      userId: req.user.id,
      examId
    });

    if (existingResult) {
      return res.status(400).json({ 
        message: 'คุณได้ทำข้อสอบนี้ไปแล้ว' 
      });
    }

    // สร้าง session สำหรับการสอบ
    const examSession = {
      startTime: new Date(),
      questions: exam.questions.map(q => ({
        id: q._id,
        content: q.content,
        options: q.options
      }))
    };

    res.json({ 
      message: 'เริ่มการสอบ', 
      examSession 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการเริ่มการสอบ', 
      error 
    });
  }
};

// ส่งคำตอบและบันทึกผลสอบ
exports.submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    const exam = await Exam.findById(examId)
      .populate('questions', 'correctAnswer');

    if (!exam) {
      return res.status(404).json({ message: 'ไม่พบการสอบที่ระบุ' });
    }

    // คำนวณคะแนน
    let score = 0;
    const questionResults = exam.questions.map((question, index) => {
      const isCorrect = question.correctAnswer === answers[index];
      if (isCorrect) score++;
      return {
        questionId: question._id,
        userAnswer: answers[index],
        isCorrect
      };
    });

    // บันทึกผลสอบ
    const quizResult = new QuizResult({
      userId: req.user.id,
      examId,
      score: (score / exam.totalQuestions) * 100,
      answers: questionResults,
      completedAt: new Date()
    });

    await quizResult.save();

    res.json({ 
      message: 'บันทึกผลการสอบสำเร็จ', 
      result: {
        score: quizResult.score,
        totalQuestions: exam.totalQuestions,
        correctAnswers: score
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการบันทึกผลการสอบ', 
      error 
    });
  }
};

// ดูผลการสอบ
exports.getExamResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const result = await QuizResult.findOne({
      userId: req.user.id,
      examId
    })
    .populate('examId', 'title totalQuestions')
    .populate('answers.questionId', 'content options correctAnswer explanation');

    if (!result) {
      return res.status(404).json({ 
        message: 'ไม่พบผลการสอบ' 
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงผลการสอบ', 
      error 
    });
  }
};
