// controllers/feedbackController.js
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

// บันทึกความคิดเห็นต่อข้อสอบ
exports.submitQuizFeedback = async (req, res) => {
  try {
    const { quizResultId, rating, comment, improvements } = req.body;
    const userId = req.user.id;

    // ตรวจสอบว่ามีผลการสอบนี้จริงๆ
    const quizResult = await QuizResult.findOne({
      _id: quizResultId,
      userId: userId
    });

    if (!quizResult) {
      return res.status(404).json({
        message: 'ไม่พบผลการสอบที่ระบุ'
      });
    }

    // บันทึกความคิดเห็น
    quizResult.feedback = {
      rating, // คะแนนความพึงพอใจ 1-5
      comment, // ความคิดเห็นทั่วไป
      improvements, // ข้อเสนอแนะเพื่อการปรับปรุง
      createdAt: new Date()
    };

    await quizResult.save();

    res.json({
      message: 'บันทึกความคิดเห็นเรียบร้อยแล้ว',
      feedback: quizResult.feedback
    });

} catch (error) {
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการบันทึกความคิดเห็น',
      error
    });
  }
};

// บันทึกการรายงานปัญหาข้อสอบ
exports.reportQuestionIssue = async (req, res) => {
  try {
    const { questionId, issueType, description } = req.body;
    const userId = req.user.id;

    // ตรวจสอบว่ามีข้อสอบนี้จริงๆ
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: 'ไม่พบข้อสอบที่ระบุ'
      });
    }

    // เพิ่มรายงานปัญหา
    const report = {
      userId,
      issueType, // ประเภทปัญหา: 'wrong_answer', 'unclear', 'technical', etc.
      description, // รายละเอียดปัญหา
      status: 'pending', // สถานะเริ่มต้น
      createdAt: new Date()
    };

    question.reports = question.reports || [];
    question.reports.push(report);
    await question.save();

    // แจ้งเตือนผู้ดูแลระบบ (ถ้ามีระบบแจ้งเตือน)
    // notificationService.notifyAdmin('question_report', report);

    res.json({
      message: 'บันทึกรายงานปัญหาเรียบร้อยแล้ว',
      report
    });

} catch (error) {
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการรายงานปัญหา',
      error
    });
  }
};

// ดึงข้อมูลความคิดเห็นทั้งหมดของข้อสอบ
exports.getQuizFeedbacks = async (req, res) => {
  try {
    const { subjectId, startDate, endDate } = req.query;
    let query = {};

    if (subjectId) {
      query['examId.subjectId'] = subjectId;
    }

    if (startDate && endDate) {
      query['feedback.createdAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const feedbacks = await QuizResult.find(query)
      .select('feedback score examId userId')
      .populate('userId', 'username')
      .populate('examId', 'title subjectId');

    // วิเคราะห์ความคิดเห็น
    const analysis = {
      totalFeedbacks: feedbacks.length,
      averageRating: 0,
      ratingDistribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      },
      commonImprovements: {}
    };

    feedbacks.forEach(feedback => {
      if (feedback.feedback?.rating) {
        analysis.averageRating += feedback.feedback.rating;
        analysis.ratingDistribution[feedback.feedback.rating]++;
      }

      // วิเคราะห์ข้อเสนอแนะที่พบบ่อย
      if (feedback.feedback?.improvements) {
        feedback.feedback.improvements.forEach(improvement => {
          analysis.commonImprovements[improvement] = 
            (analysis.commonImprovements[improvement] || 0) + 1;
        });
      }
    });

    if (analysis.totalFeedbacks > 0) {
      analysis.averageRating /= analysis.totalFeedbacks;
    }

    res.json({
      feedbacks,
      analysis
    });

  } catch (error) {
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลความคิดเห็น',
      error
    });
  }
};

// อัพเดทสถานะรายงานปัญหา (สำหรับผู้ดูแลระบบ)
exports.updateReportStatus = async (req, res) => {
  try {
    const { questionId, reportId, status, adminResponse } = req.body;

    // ตรวจสอบสิทธิ์ผู้ดูแลระบบ
    if (!req.user.isAdmin) {
        return res.status(403).json({
          message: 'ไม่มีสิทธิ์ในการดำเนินการนี้'
        });
      }
  
      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({
          message: 'ไม่พบข้อสอบที่ระบุ'
        });
      }
  
      // อัพเดทสถานะรายงาน
      const report = question.reports.id(reportId);
      if (!report) {
        return res.status(404).json({
          message: 'ไม่พบรายงานที่ระบุ'
        });
      }
  
      report.status = status;
      report.adminResponse = adminResponse;
      report.resolvedAt = new Date();
      report.resolvedBy = req.user.id;
  
      await question.save();
  
      // แจ้งเตือนผู้รายงานปัญหา (ถ้ามีระบบแจ้งเตือน)
      // notificationService.notifyUser(report.userId, 'report_updated', report);
  
      res.json({
        message: 'อัพเดทสถานะรายงานเรียบร้อยแล้ว',
        report
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะรายงาน',
        error
      });
    }
};
  