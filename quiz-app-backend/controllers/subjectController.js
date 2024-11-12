// controllers/subjectController.js
const Subject = require('../models/Subject');

// ดึงรายการวิชาทั้งหมด
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิชา', error });
  }
};

// ดึงข้อมูลวิชาตาม ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('createdBy', 'username');
    if (!subject) {
      return res.status(404).json({ message: 'ไม่พบวิชาที่ระบุ' });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลวิชา', error });
  }
};

// สร้างวิชาใหม่
exports.createSubject = async (req, res) => {
  try {
    const { name, grade, description } = req.body;
    const newSubject = new Subject({
      name,
      grade,
      description,
      createdBy: req.user.id // ต้องมาจาก middleware auth
    });
    await newSubject.save();
    res.status(201).json({ message: 'สร้างวิชาสำเร็จ', subject: newSubject });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างวิชา', error });
  }
};

// อัพเดตข้อมูลวิชา
exports.updateSubject = async (req, res) => {
  try {
    const { name, grade, description } = req.body;
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'ไม่พบวิชาที่ระบุ' });
    }

    // ตรวจสอบสิทธิ์ (เฉพาะผู้สร้างหรือ admin)
    if (subject.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขวิชานี้' });
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, grade, description },
      { new: true }
    );

    res.status(200).json({ message: 'อัพเดตวิชาสำเร็จ', subject: updatedSubject });
