// controllers/reportController.js
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Subject = require('../models/Subject');

// รายงานผลการสอบรายบุคคล
exports.generateUserReport = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    let query = { userId };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const results = await QuizResult.find(query)
      .populate('examId', 'title subjectId')
      .populate('subjectId', 'name grade');

    // คำนวณสถิติ
    const stats = {
      totalExams: results.length,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 100,
      subjectPerformance: {}
    };

    results.forEach(result => {
      // คำนวณคะแนนเฉลี่ย
      stats.averageScore += result.score;
      stats.highestScore = Math.max(stats.highestScore, result.score);
      stats.lowestScore = Math.min(stats.lowestScore, result.score);

      // คำนวณผลการเรียนรายวิชา
      const subjectId = result.examId.subjectId.toString();
      if (!stats.subjectPerformance[subjectId]) {
        stats.subjectPerformance[subjectId] = {
          name: result.subjectId.name,
          totalExams: 0,
          averageScore: 0
        };
      }
      stats.subjectPerformance[subjectId].totalExams++;
      stats.subjectPerformance[subjectId].averageScore += result.score;
    });

    // คำนวณค่าเฉลี่ย
    if (stats.totalExams > 0) {
      stats.averageScore /= stats.totalExams;
      Object.keys(stats.subjectPerformance).forEach(subjectId => {
        const subject = stats.subjectPerformance[subjectId];
        subject.averageScore /= subject.totalExams;
      });
    }

    res.json({
      stats,
      results
    });
  } catch (error) {
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการสร้างรายงาน',
      error
    });
  }
};

// รายงานผลการสอบรายวิชา
exports.generateSubjectReport = async (req, res) => {
    try {
      const { subjectId, startDate, endDate } = req.query;
      let query = { 'examId.subjectId': subjectId };
  
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
  
      const results = await QuizResult.find(query)
        .populate('userId', 'username')
        .populate('examId', 'title difficulty');
  
      // คำนวณสถิติ
      const stats = {
        totalStudents: new Set(results.map(r => r.userId._id.toString())).size,
        totalExams: results.length,
        averageScore: 0,
        scoreDistribution: {
          '0-20': 0,
          '21-40': 0,
          '41-60': 0,
          '61-80': 0,
          '81-100': 0
        },
        difficultyAnalysis: {}
      };

      results.forEach(result => {
        // คำนวณคะแนนเฉลี่ย
        stats.averageScore += result.score;
  
        // คำนวณการกระจายของคะแนน
        if (result.score <= 20) stats.scoreDistribution['0-20']++;
        else if (result.score <= 40) stats.scoreDistribution['21-40']++;
        else if (result.score <= 60) stats.scoreDistribution['41-60']++;
        else if (result.score <= 80) stats.scoreDistribution['61-80']++;
        else stats.scoreDistribution['81-100']++;
  
        // วิเคราะห์ตามระดับความยาก
        const difficulty = result.examId.difficulty;
        if (!stats.difficultyAnalysis[difficulty]) {
          stats.difficultyAnalysis[difficulty] = {
            count: 0,
            totalScore: 0
          };
        }
        stats.difficultyAnalysis[difficulty].count++;
        stats.difficultyAnalysis[difficulty].totalScore += result.score;
      });
  
      // คำนวณค่าเฉลี่ย
      if (stats.totalExams > 0) {
        stats.averageScore /= stats.totalExams;
        Object.keys(stats.difficultyAnalysis).forEach(difficulty => {
          const analysis = stats.difficultyAnalysis[difficulty];
          analysis.averageScore = analysis.totalScore / analysis.count;
        });
      }
  
      res.json({
        stats,
        results
      });
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการสร้างรายงาน',
        error
      });
    }
  };

// รายงานภาพรวมระบบ
exports.generateSystemReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let dateQuery = {};
  
      if (startDate && endDate) {
        dateQuery = {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        };
      }
  
      // รวบรวมข้อมูลสถิติ
      const stats = {
        users: {
          total: await User.countDocuments(),
          new: await User.countDocuments({
            ...dateQuery
          })
        },
        quizzes: {
          total: await QuizResult.countDocuments(),
          completed: await QuizResult.countDocuments({
            ...dateQuery
          })
        },
        subjects: {
          total: await Subject.countDocuments(),
          active: await Subject.countDocuments({ isActive: true })
        }
      };

    // คำนวณค่าเฉลี่ยคะแนนทั้งระบบ
    const scoreStats = await QuizResult.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: null,
            averageScore: { $avg: '$score' },
            highestScore: { $max: '$score' },
            lowestScore: { $min: '$score' }
          }
        }
      ]);
  
      if (scoreStats.length > 0) {
        stats.scores = {
          average: scoreStats[0].averageScore,
          highest: scoreStats[0].highestScore,
          lowest: scoreStats[0].lowestScore
        };
      }
  
      // วิเคราะห์การใช้งานรายวัน
      const dailyUsage = await QuizResult.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            averageScore: { $avg: '$score' }
          }
        },
        { $sort: { '_id': 1 } }
      ]);
  
      res.json({
        stats,
        dailyUsage
      });
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการสร้างรายงาน',
        error
      });
    }
  };

// ส่งออกรายงานเป็น PDF
exports.exportReportPDF = async (req, res) => {
    try {
      const { reportType, ...params } = req.query;
      let reportData;
  
      // ดึงข้อมูลตามประเภทรายงาน
      switch (reportType) {
        case 'user':
          reportData = await exports.generateUserReport(params);
          break;
        case 'subject':
          reportData = await exports.generateSubjectReport(params);
          break;
        case 'system':
          reportData = await exports.generateSystemReport(params);
          break;
        default:
          return res.status(400).json({ message: 'ประเภทรายงานไม่ถูกต้อง' });
      }
  
      // สร้าง PDF
      const pdf = await generatePDF(reportData);
  
      // ส่งไฟล์ PDF กลับ
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report-${reportType}.pdf`);
      res.send(pdf);
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการส่งออกรายงาน',
        error
      });
    }
};
          