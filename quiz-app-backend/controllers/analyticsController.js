// controllers/analyticsController.js
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Question = require('../models/Question');

// วิเคราะห์ประสิทธิภาพการเรียนรู้
exports.analyzeLearningPerformance = async (req, res) => {
  try {
    const { userId, subjectId, timeframe } = req.query;
    let dateQuery = {};

    // กำหนดช่วงเวลาการวิเคราะห์
    if (timeframe) {
      const now = new Date();
      switch (timeframe) {
        case 'week':
          dateQuery = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
          break;
        case 'month':
          dateQuery = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'year':
          dateQuery = { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) };
          break;
      }
    }

    // สร้าง query ตามเงื่อนไข
    let query = { createdAt: dateQuery };
    if (userId) query.userId = userId;
    if (subjectId) query['examId.subjectId'] = subjectId;

    // วิเคราะห์ผลการเรียน
    const performance = await QuizResult.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userId',
          averageScore: { $avg: '$score' },
          totalQuizzes: { $sum: 1 },
          improvement: {
            $avg: {
              $subtract: [
                '$score',
                { $arrayElemAt: ['$previousScores', 0] }
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      }
    ]);

    // วิเคราะห์แนวโน้มการเรียนรู้
    const learningTrends = await QuizResult.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              userId: '$userId',
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            },
            dailyAverage: { $avg: '$score' }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]);
  
      res.json({
        performance,
        learningTrends
      });
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการวิเคราะห์ประสิทธิภาพการเรียนรู้',
        error
      });
    }
  };

// วิเคราะห์ความยากของคำถาม
exports.analyzeQuestionDifficulty = async (req, res) => {
    try {
      const questions = await Question.aggregate([
        {
          $lookup: {
            from: 'quizresults',
            localField: '_id',
            foreignField: 'answers.questionId',
            as: 'attempts'
          }
        },
        {
          $project: {
            content: 1,
            difficulty: 1,
            totalAttempts: { $size: '$attempts' },
            correctAttempts: {
              $size: {
                $filter: {
                  input: '$attempts',
                  as: 'attempt',
                  cond: { $eq: ['$$attempt.isCorrect', true] }
                }
              }
            }
          }
        },
        {
          $addFields: {
            successRate: {
              $multiply: [
                { $divide: ['$correctAttempts', '$totalAttempts'] },
                100
              ]
            }
          }
        }
      ]);

    // จัดกลุ่มตามระดับความยาก
    const difficultyAnalysis = questions.reduce((acc, question) => {
        if (!acc[question.difficulty]) {
          acc[question.difficulty] = {
            count: 0,
            averageSuccessRate: 0,
            questions: []
          };
        }
        acc[question.difficulty].count++;
        acc[question.difficulty].averageSuccessRate += question.successRate;
        acc[question.difficulty].questions.push(question);
        return acc;
      }, {});
  
      // คำนวณค่าเฉลี่ยสำหรับแต่ละระดับความยาก
      Object.keys(difficultyAnalysis).forEach(difficulty => {
        const analysis = difficultyAnalysis[difficulty];
        analysis.averageSuccessRate /= analysis.count;
      });
  
      res.json(difficultyAnalysis);
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการวิเคราะห์ความยากของคำถาม',
        error
      });
    }
  };

    // วิเคราะห์ระยะเวลาในการทำข้อสอบ
    const durationAnalysis = await QuizResult.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: '$userId',
            averageDuration: { $avg: '$duration' },
            totalQuizzes: { $sum: 1 }
          }
        }
      ]);

    // วิเคราะห์รูปแบบการตอบคำถาม
    const answerPatterns = await QuizResult.aggregate([
        { $match: dateQuery },
        {
          $unwind: '$answers'
        },
        {
          $group: {
            _id: '$userId',
            patternAnalysis: {
              $push: {
                questionId: '$answers.questionId',
                timeSpent: '$answers.timeSpent',
                isCorrect: '$answers.isCorrect'
              }
            }
          }
        }
      ]);

      res.json({
        timeAnalysis,
        durationAnalysis,
        answerPatterns
      });
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการวิเคราะห์พฤติกรรมการใช้งาน',
        error
      });
    }
  };
  
  // วิเคราะห์ประสิทธิภาพของระบบ
  exports.analyzeSystemPerformance = async (req, res) => {
    try {
      // วิเคราะห์การใช้งานระบบ
      const systemUsage = {
        activeUsers: await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
        totalQuizzes: await QuizResult.countDocuments(),
        averageResponseTime: await calculateAverageResponseTime(),
        errorRate: await calculateErrorRate()
      };

    // วิเคราะห์ประสิทธิภาพการทำงาน
    const performance = {
        cpu: await getCPUUsage(),
        memory: await getMemoryUsage(),
        storage: await getStorageUsage()
      };
  
      // วิเคราะห์การเข้าถึง API
      const apiUsage = await analyzeAPIUsage();
  
      res.json({
        systemUsage,
        performance,
        apiUsage
      });
    } catch (error) {
      res.status(500).json({
        message: 'เกิดข้อผิดพลาดในการวิเคราะห์ประสิทธิภาพระบบ',
        error
      });
    }
  };
              