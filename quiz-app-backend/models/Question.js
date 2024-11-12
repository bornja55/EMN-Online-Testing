// models/Question.js

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examTypeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  grade: { type: String, required: true },
  difficulty: { type: String, required: true },
  year: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
