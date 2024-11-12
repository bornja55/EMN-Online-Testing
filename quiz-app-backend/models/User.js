// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },          // เพิ่มอีเมล
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  grade: { type: String, required: function() {                   // เพิ่มระดับชั้น
    return this.role === 'student';
  }},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
