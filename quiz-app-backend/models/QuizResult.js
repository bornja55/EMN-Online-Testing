// models/QuizResult.js

const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    }
  ],
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizResultSchema);
