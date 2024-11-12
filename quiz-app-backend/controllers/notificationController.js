// controllers/adminController.js
const User = require('../models/User');
const Subject = require('../models/Subject');
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');

// จัดการผู้ใช้งาน
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้', 
      error 
    });
  }
};

// อัพเดตสถานะผู้ใช้
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { status, role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่ระบุ' });
    }

    res.json({ 
      message: 'อัพเดตสถานะผู้ใช้สำเร็จ', 
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการอัพเดตสถานะผู้ใช้', 
      error 
    });
  }
};

// จัดการระบบ
exports.getSystemStats = async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      subjects: await Subject.countDocuments(),
      questions: await Question.countDocuments(),
      quizResults: await QuizResult.countDocuments(),
      activeUsers: await User.countDocuments({ status: 'active' }),
      pendingUsers: await User.countDocuments({ status: 'pending' })
    };

    // สถิติการใช้งานรายวัน
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    stats.todayQuizzes = await QuizResult.countDocuments({
      createdAt: { $gte: today }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ', 
      error 
    });
  }
};

// จัดการการแจ้งเตือนระบบ
exports.getSystemLogs = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (type) {
      query.type = type;
    }

    const logs = await SystemLog.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล logs', 
      error 
    });
  }
};

// จัดการการตั้งค่าระบบ
exports.updateSystemSettings = async (req, res) => {
  try {
    const { 
      maintenanceMode,
      allowRegistration,
      maxLoginAttempts,
      sessionTimeout,
      emailSettings
    } = req.body;

    const settings = await SystemSettings.findOneAndUpdate(
      {},
      {
        maintenanceMode,
        allowRegistration,
        maxLoginAttempts,
        sessionTimeout,
        emailSettings,
        updatedBy: req.user.id,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({ 
      message: 'อัพเดตการตั้งค่าระบบสำเร็จ', 
      settings 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการอัพเดตการตั้งค่า', 
      error 
    });
  }
};

// จัดการการสำรองข้อมูล
exports.backupDatabase = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `backups/backup-${timestamp}.gz`;

    // สร้างไฟล์สำรองข้อมูล
    await createBackup(backupPath);

    // บันทึกประวัติการสำรองข้อมูล
    const backup = new BackupHistory({
      filename: backupPath,
      createdBy: req.user.id,
      size: await getFileSize(backupPath)
    });
    await backup.save();

    res.json({ 
      message: 'สำรองข้อมูลสำเร็จ', 
      backup 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการสำรองข้อมูล', 
      error 
    });
  }
};

// กู้คืนข้อมูล
exports.restoreDatabase = async (req, res) => {
  try {
    const { backupId } = req.params;
    const backup = await BackupHistory.findById(backupId);

    if (!backup) {
      return res.status(404).json({ message: 'ไม่พบไฟล์สำรองข้อมูล' });
    }

    // กู้คืนข้อมูล
    await restoreBackup(backup.filename);

    backup.lastRestored = new Date();
    backup.restoredBy = req.user.id;
    await backup.save();

    res.json({ 
      message: 'กู้คืนข้อมูลสำเร็จ', 
      backup 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการกู้คืนข้อมูล', 
      error 
    });
  }
};

