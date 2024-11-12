// app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // โหลดค่าต่าง ๆ จากไฟล์ .env
const app = express();


// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // ตั้งค่า CORS ให้อนุญาตเฉพาะ frontend ที่กำหนดไว้
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Import routes (หากคุณมีเส้นทางสำหรับ API อื่น ๆ ให้เพิ่มที่นี่)
// const userRoutes = require('./routes/userRoutes'); // ตัวอย่าง
// app.use('/api/users', userRoutes); // เส้นทางสำหรับผู้ใช้
// app.js
const userRoutes = require('./routes/userRoutes');
const quizResultRoutes = require('./routes/quizResultRoutes'); // เพิ่มนี้
app.use('/api/users', userRoutes);
app.use('/api/quiz-results', quizResultRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
