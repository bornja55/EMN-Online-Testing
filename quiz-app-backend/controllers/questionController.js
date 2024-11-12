// controllers/questionController.js
const Question = require('../models/Question');

// สร้างคำถามใหม่
exports.createQuestion = async (req, res) => {
  try {
    const { 
      subjectId, 
      content, 
      options, 
      correctAnswer, 
      explanation,
      difficulty 
    } = req.body;

    const newQuestion = new Question({
      subjectId,
      content,
      options,
      correctAnswer,
      explanation,
      difficulty,
      createdBy: req.user.id
    });

    await newQuestion.save();
    res.status(201).json({ 
      message: 'สร้างคำถามสำเร็จ', 
      question: newQuestion 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการสร้างคำถาม', 
      error 
    });
  }
};

// ดึงคำถามตามวิชา
exports.getQuestionsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const questions = await Question.find({ subjectId })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงคำถาม', 
      error 
    });
  }
};

// สุ่มคำถามสำหรับแบบทดสอบ
exports.getRandomQuestions = async (req, res) => {
  try {
    const { subjectId, count = 10, difficulty } = req.query;
    let query = { subjectId };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการสุ่มคำถาม', 
      error 
    });
  }
};

// อัพเดตคำถาม
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      content, 
      options, 
      correctAnswer, 
      explanation,
      difficulty 
    } = req.body;

    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({ message: 'ไม่พบคำถามที่ระบุ' });
    }

    // ตรวจสอบสิทธิ์
    if (question.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขคำถามนี้' });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { content, options, correctAnswer, explanation, difficulty },
      { new: true }
    );

    res.json({ 
      message: 'อัพเดตคำถามสำเร็จ', 
      question: updatedQuestion 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการอัพเดตคำถาม', 
      error 
    });
  }
};

// ลบคำถาม
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({ message: 'ไม่พบคำถามที่ระบุ' });
    }

    // ตรวจสอบสิทธิ์
    if (question.createdBy.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบคำถามนี้' });
    }

    await Question.findByIdAndDelete(id);
    res.json({ message: 'ลบคำถามสำเร็จ' });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการลบคำถาม', 
      error 
    });
  }
};