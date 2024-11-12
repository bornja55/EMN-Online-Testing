// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ตรวจสอบ Token
const verifyToken = async (req, res, next) => {
  try {
    // ดึง token จาก header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: 'กรุณาเข้าสู่ระบบ'
      });
    }

    // ตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ดึงข้อมูลผู้ใช้
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // เพิ่มข้อมูลผู้ใช้ใน request
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token ไม่ถูกต้อง'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่'
      });
    }
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
      error
    });
  }
};

// ตรวจสอบสิทธิ์ผู้ดูแลระบบ
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      message: 'ไม่มีสิทธิ์ในการดำเนินการนี้'
    });
  }
  next();
};

// ตรวจสอบสิทธิ์ครูผู้สอน
const isTeacher = (req, res, next) => {
  if (!req.user.isTeacher && !req.user.isAdmin) {
    return res.status(403).json({
      message: 'ไม่มีสิทธิ์ในการดำเนินการนี้'
    });
  }
  next();
};

// ตรวจสอบเจ้าของทรัพยากร
const isResourceOwner = (resourceModel) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await resourceModel.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({
        message: 'ไม่พบทรัพยากรที่ระบุ'
      });
    }

    if (resource.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        message: 'ไม่มีสิทธิ์ในการดำเนินการนี้'
      });
    }

    req.resource = resource;
    next();
    
  } catch (error) {
    res.status(500).json({
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์',
      error
    });
  }
};

// ตรวจสอบสถานะการใช้งาน
const isActive = async (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      message: 'บัญชีผู้ใช้ถูกระงับการใช้งาน'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isTeacher,
  isResourceOwner,
  isActive
};
