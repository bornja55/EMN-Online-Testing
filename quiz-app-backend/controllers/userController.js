// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ลงทะเบียนผู้ใช้ใหม่
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // ตรวจสอบว่ามี username หรือ email ซ้ำหรือไม่
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username หรือ Email นี้ถูกใช้งานแล้ว' 
      });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'student' // ถ้าไม่ระบุ role ให้เป็น student
    });

    await user.save();

    // สร้าง token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'ลงทะเบียนสำเร็จ',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error });
  }
};

// เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ค้นหาผู้ใช้
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    // ตรวจสอบรหัสผ่าน
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error });
  }
};

// ดึงข้อมูลผู้ใช้ปัจจุบัน
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้', error });
  }
};

// อัพเดตข้อมูลผู้ใช้
exports.updateUser = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // ถ้ามีการเปลี่ยนรหัสผ่าน
    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // อัพเดตอีเมล
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
      }
      user.email = email;
    }

    await user.save();
    res.json({ message: 'อัพเดตข้อมูลสำเร็จ', user });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัพเดตข้อมูล', error });
  }
};

// ดึงประวัติการสอบของผู้ใช้
exports.getUserHistory = async (req, res) => {
  try {
    const quizResults = await QuizResult.find({ userId: req.user.id })
      .populate('subjectId', 'name grade')
      .sort({ createdAt: -1 });

    res.json(quizResults);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติการสอบ', error });
  }
};