// server.js
require('dotenv').config();               // โหลดค่าสภาพแวดล้อมจากไฟล์ .env
const express = require('express');        // เรียกใช้ express
const mongoose = require('mongoose');      // เรียกใช้ mongoose
const cors = require('cors');              // เรียกใช้ cors
const bodyParser = require('body-parser'); // เรียกใช้ body-parser


// กำหนดค่าจาก .env
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect MongoDB", err));
const JWT_SECRET = process.env.JWT_SECRET;

// สร้างแอป Express
const app = express();

// เปิดใช้งาน middleware
app.use(cors({ origin: process.env.CORS_ORIGIN })); // กำหนดที่มาของการร้องขอ
app.use(bodyParser.json());                         // จัดการกับ JSON request body

// เชื่อมต่อ MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect MongoDB", err));

// สร้าง route ทดลอง
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
