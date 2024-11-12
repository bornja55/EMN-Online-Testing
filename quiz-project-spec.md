# โครงการระบบทดสอบออนไลน์

## สารบัญ
1. [ภาพรวมระบบ](#1-ภาพรวมระบบ)
2. [การติดตั้งและเตรียมการ](#2-การติดตั้งและเตรียมการ)
3. [โครงสร้างระบบ](#3-โครงสร้างระบบ)
4. [ระบบผู้ใช้งาน](#4-ระบบผู้ใช้งาน)
5. [ระบบข้อสอบ](#5-ระบบข้อสอบ)
6. [ระบบคะแนนและประวัติ](#6-ระบบคะแนนและประวัติ)
7. [การนำเข้าข้อมูล](#7-การนำเข้าข้อมูล)
8. [LINE Integration](#8-line-integration)
9. [Security & Deployment](#9-security--deployment)
10. [Future Improvements](#10-future-improvements)

## 1. ภาพรวมระบบ
- ระบบแบบทดสอบออนไลน์แยกตามวิชาและระดับชั้น
- รองรับการสุ่มข้อสอบและตัวเลือก
- ฟรี hosting
- ระบบแนะนำข้อสอบตามความสามารถผู้เรียน
- ระบบติดตามความก้าวหน้า

## 2. การติดตั้งและเตรียมการ

### 2.1 โปรแกรมพื้นฐานที่จำเป็น
1. **Node.js**
   - ดาวน์โหลดจาก: https://nodejs.org/
   - ติดตั้งเวอร์ชั่น LTS (20.x ขึ้นไป)
   - ตรวจสอบด้วย: `node --version` และ `npm --version`

2. **Git**
   - ดาวน์โหลดจาก: https://git-scm.com/downloads
   - ตรวจสอบด้วย: `git --version`

3. **Code Editor**
   - Visual Studio Code: https://code.visualstudio.com/
   - Extensions ที่แนะนำ:
     - ESLint
     - Prettier
     - GitLens
     - MongoDB for VS Code
     - Tailwind CSS IntelliSense

4. **Database Tools**
   - MongoDB Compass: https://www.mongodb.com/products/compass
   - Postman: https://www.postman.com/downloads/

### 2.2 การสมัครบริการ
1. **GitHub**
   - สมัครที่: https://github.com/
   - สร้าง repository ใหม่

2. **MongoDB Atlas**
   - สมัครที่: https://www.mongodb.com/cloud/atlas/register
   - สร้าง Free Tier Cluster
   - ตั้งค่า Database User และ IP Whitelist

3. **Vercel (Frontend)**
   - สมัครที่: https://vercel.com/signup
   - เชื่อมต่อกับ GitHub

4. **Railway (Backend)**
   - สมัครที่: https://railway.app/
   - เชื่อมต่อกับ GitHub

### 2.3 การติดตั้งโปรเจค

#### Frontend
```bash
# สร้างโปรเจค Next.js
npx create-next-app@latest quiz-app
cd quiz-app

# ติดตั้ง dependencies
npm install @/components/ui
npm install tailwindcss postcss autoprefixer
npm install axios jsonwebtoken
npm install react-query
npm install react-hook-form

# ตั้งค่า Tailwind
npx tailwindcss init -p
```

#### Backend
```bash
# สร้างโปรเจค
mkdir quiz-app-backend
cd quiz-app-backend
npm init -y

# ติดตั้ง dependencies
npm install express mongoose dotenv cors
npm install jsonwebtoken bcryptjs
npm install nodemon --save-dev
```

### 2.4 Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_LIFF_ID=your-liff-id
```

#### Backend (.env)
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
LINE_CHANNEL_ID=your-channel-id
LINE_CHANNEL_SECRET=your-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-access-token
```

## 3. โครงสร้างระบบ

### 3.1 เทคโนโลยีที่ใช้
- Frontend: Next.js 14, Tailwind CSS, ShadcnUI
- Backend: Node.js, Express.js, MongoDB
- Hosting: Vercel, Railway, MongoDB Atlas

### 3.2 โครงสร้างฐานข้อมูลหลัก
```javascript
// Users
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  role: String,
  grade: String,
  createdAt: Date
}

// Subjects
{
  _id: ObjectId,
  name: String,
  grade: String,
  description: String,
  createdBy: ObjectId
}

// Questions
{
  _id: ObjectId,
  subjectId: ObjectId,
  examTypeId: ObjectId,
  programId: ObjectId,
  question: String,
  options: [String],
  correctAnswer: String,
  grade: String,
  difficulty: String,
  year: Number,
  createdBy: ObjectId
}

// QuizResults
{
  _id: ObjectId,
  userId: ObjectId,
  subjectId: ObjectId,
  score: Number,
  totalQuestions: Number,
  answers: [{
    questionId: ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean
  }],
  completedAt: Date
}
```

[ส่วนที่เหลือยังคงเดิม แต่จัดเรียงใหม่...]

## 4. ระบบผู้ใช้งาน
### 4.1 นักเรียน
- ลงทะเบียน/เข้าสู่ระบบ
- เลือกวิชาและระดับชั้น
- ทำแบบทดสอบ
- ดูผลคะแนนและประวัติการทำแบบทดสอบ

### 4.2 ครู/แอดมิน
- จัดการข้อสอบ (เพิ่ม/แก้ไข/ลบ)
- จัดการวิชาและระดับชั้น
- ดูรายงานผลคะแนน
- จัดการผู้ใช้งาน

## 5. ระบบข้อสอบ
[รายละเอียดระบบข้อสอบ...]

## 6. ระบบคะแนนและประวัติ
[รายละเอียดระบบคะแนน...]

## 7. การนำเข้าข้อมูล
[รายละเอียดการนำเข้าข้อมูล...]

## 8. LINE Integration
[รายละเอียด LINE Integration...]

## 9. Security & Deployment
[รายละเอียดความปลอดภัยและการ Deploy...]

## 10. Future Improvements
[รายละเอียดการพัฒนาในอนาคต...]

## Progress Tracking
- Version: 0.5
- Last Updated: 2024-11-07
- Status: Restructured Documentation


## 5. API Endpoints
### 5.1 Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### 5.2 Subjects
- GET /api/subjects
- POST /api/subjects
- PUT /api/subjects/:id
- DELETE /api/subjects/:id

### 5.3 Questions
- GET /api/questions
- POST /api/questions
- PUT /api/questions/:id
- DELETE /api/questions/:id

### 5.4 Quiz
- GET /api/quiz/generate
- POST /api/quiz/submit

### 5.5 Results
- GET /api/results
- GET /api/results/:id

## 6. Features ที่ต้องพัฒนา
### Phase 1: พื้นฐาน
- [ ] ระบบ Authentication
- [ ] หน้าแสดงรายวิชา
- [ ] ระบบทำข้อสอบพื้นฐาน

### Phase 2: คลังข้อสอบ
- [ ] ระบบจัดการข้อสอบ
- [ ] ระบบสุ่มข้อสอบ
- [ ] การแสดงผลคะแนน

### Phase 3: รายงานและการวิเคราะห์
- [ ] รายงานผลการสอบ
- [ ] การวิเคราะห์ข้อสอบ
- [ ] Dashboard สำหรับครู

## 7. การ Deploy
1. สร้าง MongoDB Atlas cluster
2. Deploy Backend ไปที่ Railway
3. Deploy Frontend ไปที่ Vercel
4. ตั้งค่า Environment Variables
5. ทดสอบระบบ

## 8. Security Considerations
- การเข้ารหัสรหัสผ่าน
- JWT Authentication
- Rate Limiting
- Input Validation
- XSS Protection
- CORS Configuration

## 9. Future Improvements
- ระบบการแข่งขัน
- การสร้างห้องเรียนเสมือน
- ระบบติดตามความก้าวหน้า
- การเชื่อมต่อกับระบบ LMS อื่นๆ
- ระบบแชทและการติดต่อ
- การ Export ข้อมูลและรายงาน

## 10. การติดตั้งโปรแกรมที่จำเป็น

### 10.1 โปรแกรมพื้นฐาน
1. **Node.js**
   - ดาวน์โหลดจาก: https://nodejs.org/
   - ติดตั้งเวอร์ชั่น LTS (เวอร์ชั่น 20.x ขึ้นไป)
   - ตรวจสอบการติดตั้งด้วยคำสั่ง: `node --version` และ `npm --version`

2. **Git**
   - ดาวน์โหลดจาก: https://git-scm.com/downloads
   - ตรวจสอบการติดตั้งด้วยคำสั่ง: `git --version`

3. **Visual Studio Code**
   - ดาวน์โหลดจาก: https://code.visualstudio.com/
   - Extensions ที่แนะนำ:
     - ESLint
     - Prettier
     - GitLens
     - MongoDB for VS Code
     - Tailwind CSS IntelliSense

### 10.2 Database Tools (ทางเลือก)
1. **MongoDB Compass**
   - ดาวน์โหลดจาก: https://www.mongodb.com/products/compass
   - ใช้สำหรับจัดการฐานข้อมูล MongoDB แบบ GUI

2. **Postman**
   - ดาวน์โหลดจาก: https://www.postman.com/downloads/
   - ใช้สำหรับทดสอบ API

## 11. การสมัครบริการที่จำเป็น

### 11.1 GitHub
1. เข้าไปที่ https://github.com/
2. สร้างบัญชีใหม่ (Sign up)
3. ยืนยันอีเมล
4. สร้าง repository สำหรับโปรเจค

### 11.2 MongoDB Atlas (ฐานข้อมูล)
1. เข้าไปที่ https://www.mongodb.com/cloud/atlas/register
2. สมัครบัญชีใหม่
3. สร้าง Free Tier Cluster:
   - เลือก M0 Sandbox (Free forever)
   - เลือก Region ที่ใกล้ที่สุด
   - เพิ่ม Database User
   - เพิ่ม IP Whitelist (0.0.0.0/0 สำหรับพัฒนา)
4. รับ Connection String สำหรับเชื่อมต่อ

### 11.3 Vercel (Frontend Hosting)
1. เข้าไปที่ https://vercel.com/signup
2. สมัครโดยใช้บัญชี GitHub
3. Import โปรเจคจาก GitHub
4. ตั้งค่า Environment Variables
5. Deploy!

### 11.4 Railway (Backend Hosting)
1. เข้าไปที่ https://railway.app/
2. สมัครโดยใช้บัญชี GitHub
3. สร้าง New Project
4. เลือก Deploy from GitHub repo
5. ตั้งค่า Environment Variables
6. Free Tier Limits:
   - $5 หรือ 500 ชั่วโมงต่อเดือน
   - รองรับ Custom Domains

## 12. ขั้นตอนการติดตั้งโปรเจค

### 12.1 การติดตั้ง Frontend
```bash
# สร้างโปรเจค Next.js
npx create-next-app@latest quiz-app
cd quiz-app

# ติดตั้ง dependencies
npm install @/components/ui
npm install tailwindcss postcss autoprefixer
npm install axios jsonwebtoken
npm install react-query
npm install react-hook-form

# ติดตั้ง Tailwind CSS
npx tailwindcss init -p
```

### 12.2 การติดตั้ง Backend
```bash
# สร้างโฟลเดอร์โปรเจค
mkdir quiz-app-backend
cd quiz-app-backend

# สร้างไฟล์ package.json
npm init -y

# ติดตั้ง dependencies
npm install express mongoose dotenv cors
npm install jsonwebtoken bcryptjs
npm install nodemon --save-dev
```

### 12.3 ไฟล์ Environment Variables ที่จำเป็น

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Backend (.env)
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

## 13. การทดสอบระบบ

### 13.1 ทดสอบ Frontend
```bash
# รัน development server
npm run dev

# รัน build
npm run build
npm start
```

### 13.2 ทดสอบ Backend
```bash
# รัน development server
npm run dev

# รัน production
npm start
```

### 13.3 ทดสอบฐานข้อมูล
1. เชื่อมต่อ MongoDB Compass กับ cluster
2. ตรวจสอบการเชื่อมต่อ
3. สร้างข้อมูลทดสอบ

[ส่วนที่ 1-13 คงเดิม...]

## 14. การนำเข้าคลังข้อสอบ

### 14.1 รูปแบบไฟล์นำเข้า
1. **Excel Template**
```
วิชา, ระดับชั้น, คำถาม, ตัวเลือก 1, ตัวเลือก 2, ตัวเลือก 3, ตัวเลือก 4, คำตอบที่ถูก, ระดับความยาก
คณิตศาสตร์, ม.1, 2+2=?, 3, 4, 5, 6, 4, ง่าย
```

2. **JSON Format**
```json
{
  "questions": [
    {
      "subject": "คณิตศาสตร์",
      "grade": "ม.1",
      "question": "2+2=?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4",
      "difficulty": "easy"
    }
  ]
}
```

### 14.2 ระบบนำเข้าข้อสอบ
1. **Backend API**
```javascript
// routes/import.js
router.post('/import/excel', upload.single('file'), importExcelQuestions);
router.post('/import/json', importJSONQuestions);
```

2. **Dependencies เพิ่มเติม**
```bash
npm install xlsx multer csv-parser
```

3. **Validation Rules**
- ตรวจสอบความถูกต้องของรูปแบบ
- ตรวจสอบข้อมูลซ้ำ
- ตรวจสอบความสมบูรณ์ของข้อมูล

## 15. การเชื่อมต่อ LINE Login

### 15.1 LINE Developers Console
1. สมัคร LINE Developers Account
   - เข้าไปที่ https://developers.line.biz/console/
   - สร้าง Provider ใหม่
   - สร้าง LINE Login channel

2. ตั้งค่า LINE Login
   - Callback URL: https://your-domain.com/api/auth/line/callback
   - Scope: profile, email
   - Bot link feature: Enabled
   - Prompt: normal

### 15.2 LINE LIFF Setup
1. **สร้าง LIFF App**
   - Size: Full
   - Endpoint URL: https://your-domain.com
   - Scope: profile, email
   - Module mode: Enable

2. **ติดตั้ง Dependencies**
```bash
# Frontend
npm install @line/liff
```

3. **ตัวอย่าง LIFF Implementation**
```javascript
// pages/_app.js
import { useEffect } from 'react'
import { liff } from '@line/liff'

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID })
      } catch (error) {
        console.error('LIFF initialization failed', error)
      }
    }
    initLiff()
  }, [])
  
  return <Component {...pageProps} />
}
```

### 15.3 LINE OA Integration

1. **สร้าง LINE Official Account**
   - เข้าไปที่ LINE Official Account Manager
   - สร้าง Official Account ใหม่
   - เชื่อมต่อกับ LINE Login channel

2. **Rich Menu Setup**
   - สร้าง Rich Menu สำหรับเมนูหลัก
   - เชื่อมโยงกับ LIFF URL

3. **Messaging API**
```javascript
// LINE Bot SDK
npm install @line/bot-sdk

// Backend Implementation
const line = require('@line/bot-sdk');
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const client = new line.Client(config);
```

### 15.4 Environment Variables เพิ่มเติม

1. **Frontend (.env.local)**
```
NEXT_PUBLIC_LIFF_ID=your-liff-id
```

2. **Backend (.env)**
```
LINE_CHANNEL_ID=your-channel-id
LINE_CHANNEL_SECRET=your-channel-secret
LINE_CHANNEL_ACCESS_TOKEN=your-access-token
```

## 16. การติดตั้งเพิ่มเติม

### 16.1 โปรแกรมสำหรับจัดการข้อสอบ
1. **Excel**
   - Microsoft Excel หรือ Google Sheets
   - LibreOffice Calc (ฟรี)

2. **Text Editor**
   - Notepad++ สำหรับแก้ไขไฟล์ JSON
   - Visual Studio Code + JSON plugins

### 16.2 บริการเพิ่มเติม
1. **LINE Developers Account**
   - สมัครที่ https://developers.line.biz/
   - ฟรีสำหรับ Developer Trial
   - มีค่าใช้จ่ายเมื่อใช้งานจริง (Messaging API)

2. **Storage Service (สำหรับไฟล์)**
   - Amazon S3 (Free tier)
   - Google Cloud Storage
   - Cloudinary (Free tier)

### 16.3 Development Tools
1. **API Testing**
   - Postman
   - Thunder Client (VS Code Extension)

2. **Database Management**
   - MongoDB Compass
   - Studio 3T (Free version)

## 17. การจัดการรูปแบบข้อสอบ

### 17.1 โครงสร้างฐานข้อมูลเพิ่มเติม

1. **ExamTypes (รูปแบบข้อสอบ)**
```javascript
{
  _id: ObjectId,
  name: String,          // เช่น "สอบเข้า ม.1", "TEDET", "สวทช"
  category: String,      // เช่น "entrance", "competition", "assessment"
  description: String,
  isActive: Boolean
}
```

2. **Programs (โปรแกรมการเรียน)**
```javascript
{
  _id: ObjectId,
  name: String,          // เช่น "ห้องคณิตวิทย์", "EP", "ปกติ"
  description: String,
  isActive: Boolean
}
```

3. **ปรับปรุง Questions Schema**
```javascript
{
  _id: ObjectId,
  subjectId: ObjectId,
  examTypeId: ObjectId,  // เพิ่มการอ้างอิงรูปแบบข้อสอบ
  programId: ObjectId,   // เพิ่มการอ้างอิงโปรแกรมการเรียน
  question: String,
  options: [String],
  correctAnswer: String,
  grade: String,
  difficulty: String,
  year: Number,         // เพิ่มปีของข้อสอบ
  createdBy: ObjectId
}
```

### 17.2 API Endpoints เพิ่มเติม

```javascript
// routes/examTypes.js
router.get('/exam-types', getExamTypes);
router.post('/exam-types', createExamType);
router.put('/exam-types/:id', updateExamType);
router.delete('/exam-types/:id', deleteExamType);

// routes/programs.js
router.get('/programs', getPrograms);
router.post('/programs', createProgram);
router.put('/programs/:id', updateProgram);
router.delete('/programs/:id', deleteProgram);

// routes/questions.js
router.get('/questions/search', searchQuestions);
router.get('/questions/filters', getQuestionFilters);
```

### 17.3 ระบบค้นหาข้อสอบ

1. **Query Parameters**
```javascript
// GET /api/questions/search
{
  grade: String,           // ระดับชั้น
  examType: ObjectId,      // รูปแบบข้อสอบ
  program: ObjectId,       // โปรแกรมการเรียน
  subject: ObjectId,       // วิชา
  year: Number,           // ปีของข้อสอบ
  difficulty: String,     // ระดับความยาก
  keyword: String,        // คำค้นหา
  page: Number,          // หน้าที่ต้องการ
  limit: Number          // จำนวนข้อต่อหน้า
}
```

2. **ตัวอย่างการ Implementation**
```javascript
// controllers/questions.js
const searchQuestions = async (req, res) => {
  try {
    const {
      grade,
      examType,
      program,
      subject,
      year,
      difficulty,
      keyword,
      page = 1,
      limit = 10
    } = req.query;

    // สร้าง query object
    const query = {};
    if (grade) query.grade = grade;
    if (examType) query.examTypeId = examType;
    if (program) query.programId = program;
    if (subject) query.subjectId = subject;
    if (year) query.year = year;
    if (difficulty) query.difficulty = difficulty;
    if (keyword) {
      query.$or = [
        { question: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    // ดึงข้อมูล
    const questions = await Question.find(query)
      .populate('examTypeId')
      .populate('programId')
      .populate('subjectId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // นับจำนวนทั้งหมด
    const total = await Question.countDocuments(query);

    res.json({
      questions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 17.4 UI Components เพิ่มเติม

```javascript
// components/QuestionSearch.js
const QuestionSearch = () => {
  const [filters, setFilters] = useState({
    grade: '',
    examType: '',
    program: '',
    subject: '',
    year: '',
    difficulty: '',
    keyword: ''
  });

  return (
    <div className="space-y-4">
      {/* ส่วนค้นหา */}
      <div className="flex gap-4">
        <select 
          value={filters.grade}
          onChange={(e) => setFilters({...filters, grade: e.target.value})}
          className="form-select"
        >
          <option value="">ระดับชั้นทั้งหมด</option>
          <option value="ป.5">ป.5</option>
          <option value="ม.1">ม.1</option>
          {/* เพิ่มตัวเลือกอื่นๆ */}
        </select>

        <select 
          value={filters.examType}
          onChange={(e) => setFilters({...filters, examType: e.target.value})}
          className="form-select"
        >
          <option value="">รูปแบบข้อสอบทั้งหมด</option>
          {/* ดึงข้อมูลจาก API */}
        </select>

        <select 
          value={filters.program}
          onChange={(e) => setFilters({...filters, program: e.target.value})}
          className="form-select"
        >
          <option value="">โปรแกรมทั้งหมด</option>
          {/* ดึงข้อมูลจาก API */}
        </select>

        <input
          type="text"
          value={filters.keyword}
          onChange={(e) => setFilters({...filters, keyword: e.target.value})}
          placeholder="ค้นหาข้อสอบ..."
          className="form-input"
        />
      </div>

      {/* แสดงผลการค้นหา */}
      <QuestionList filters={filters} />
    </div>
  );
};
```

### 17.5 การนำเข้าข้อสอบแบบมีรูปแบบ

1. **ปรับปรุง Excel Template**
```
วิชา, ระดับชั้น, รูปแบบข้อสอบ, โปรแกรม, ปีการศึกษา, คำถาม, ตัวเลือก 1, ตัวเลือก 2, ตัวเลือก 3, ตัวเลือก 4, คำตอบที่ถูก, ระดับความยาก
คณิตศาสตร์, ม.1, สอบเข้า ม.1, ห้องคณิตวิทย์, 2567, 2+2=?, 3, 4, 5, 6, 4, ง่าย
```

2. **Validation เพิ่มเติม**
- ตรวจสอบความถูกต้องของรูปแบบข้อสอบ
- ตรวจสอบความถูกต้องของโปรแกรม
- ตรวจสอบปีการศึกษา

## 18. ระบบคะแนนสะสมและประวัติการสอบ

### 18.1 โครงสร้างฐานข้อมูลเพิ่มเติม

1. **StudentProgress (คะแนนสะสม)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  totalScore: Number,      // คะแนนสะสมรวม
  totalQuizzes: Number,    // จำนวนแบบทดสอบที่ทำ
  averageScore: Number,    // คะแนนเฉลี่ย
  subjectStats: [{         // สถิติแยกตามวิชา
    subjectId: ObjectId,
    totalScore: Number,
    quizCount: Number,
    averageScore: Number,
    highestScore: Number
  }],
  examTypeStats: [{        // สถิติแยกตามรูปแบบข้อสอบ
    examTypeId: ObjectId,
    totalScore: Number,
    quizCount: Number,
    averageScore: Number
  }],
  lastUpdated: Date
}
```

2. **QuizHistory (ประวัติการสอบ)**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  quizId: ObjectId,
  examTypeId: ObjectId,
  subjectId: ObjectId,
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  timeSpent: Number,      // เวลาที่ใช้ (วินาที)
  answers: [{
    questionId: ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number     // เวลาที่ใช้ต่อข้อ
  }],
  feedback: {             // ข้อเสนอแนะหลังสอบ
    strengths: [String],
    weaknesses: [String],
    suggestedTopics: [String]
  },
  completedAt: Date
}
```

### 18.2 API Endpoints เพิ่มเติม

```javascript
// routes/progress.js
router.get('/progress/summary', getProgressSummary);
router.get('/progress/subjects', getSubjectProgress);
router.get('/progress/exam-types', getExamTypeProgress);
router.get('/progress/history', getQuizHistory);
router.get('/progress/analytics', getProgressAnalytics);

// routes/recommendations.js
router.get('/recommendations', getQuizRecommendations);
router.get('/recommendations/topics', getTopicRecommendations);
```

## 19. การสร้างชุดข้อสอบและระบบแนะนำ

### 19.1 โครงสร้างฐานข้อมูลเพิ่มเติม

1. **QuizTemplates (รูปแบบชุดข้อสอบ)**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  examTypes: [{           // รูปแบบข้อสอบที่รวม
    examTypeId: ObjectId,
    questionCount: Number,
    difficulty: String
  }],
  totalQuestions: Number,
  timeLimit: Number,      // เวลาในการทำข้อสอบ (นาที)
  passingScore: Number,   // คะแนนผ่าน
  isActive: Boolean,
  createdBy: ObjectId
}
```

2. **RecommendationRules (กฎการแนะนำข้อสอบ)**
```javascript
{
  _id: ObjectId,
  name: String,
  conditions: [{
    field: String,        // เช่น "score", "timeSpent", "errorRate"
    operator: String,     // เช่น ">", "<", "="
    value: Number
  }],
  recommendations: [{
    examTypeId: ObjectId,
    priority: Number,
    weight: Number
  }],
  isActive: Boolean
}
```

### 19.2 การสร้างชุดข้อสอบแบบผสม

```javascript
// services/quizGenerator.js
const generateMixedQuiz = async (template, userId) => {
  const quiz = {
    questions: [],
    timeLimit: template.timeLimit
  };

  // วนลูปแต่ละรูปแบบข้อสอบ
  for (const examType of template.examTypes) {
    const questions = await Question.aggregate([
      { $match: {
        examTypeId: examType.examTypeId,
        difficulty: examType.difficulty
      }},
      { $sample: { size: examType.questionCount } }
    ]);
    
    quiz.questions.push(...questions);
  }

  // สุ่มลำดับข้อสอบ
  quiz.questions = shuffleArray(quiz.questions);

  return quiz;
};
```

### 19.3 ระบบแนะนำข้อสอบ

```javascript
// services/recommendationEngine.js
const generateRecommendations = async (userId) => {
  // ดึงประวัติการสอบ
  const history = await QuizHistory.find({ userId })
    .sort({ completedAt: -1 })
    .limit(10);

  // วิเคราะห์จุดแข็ง-จุดอ่อน
  const analytics = analyzePerformance(history);

  // ดึงกฎการแนะนำ
  const rules = await RecommendationRules.find({ isActive: true });

  // คำนวณคะแนนแนะนำ
  const recommendations = rules
    .filter(rule => matchesConditions(analytics, rule.conditions))
    .flatMap(rule => rule.recommendations)
    .reduce((acc, rec) => {
      const existing = acc.find(r => r.examTypeId.equals(rec.examTypeId));
      if (existing) {
        existing.score += rec.weight;
      } else {
        acc.push({
          examTypeId: rec.examTypeId,
          score: rec.weight
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.score - a.score);

  return recommendations;
};
```

### 19.4 UI Components เพิ่มเติม

1. **หน้าประวัติการสอบ**
```javascript
// components/QuizHistory.js
const QuizHistory = () => {
  const { data: history } = useQuery('quizHistory', fetchQuizHistory);
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">ประวัติการสอบ</h2>
      
      {/* สรุปภาพรวม */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="คะแนนเฉลี่ย"
          value={history?.averageScore}
          icon={<TrendingUpIcon />}
        />
        <StatCard
          title="จำนวนการสอบ"
          value={history?.totalQuizzes}
          icon={<ActivityIcon />}
        />
        {/* เพิ่มสถิติอื่นๆ */}
      </div>

      {/* ตารางประวัติ */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>วิชา</th>
              <th>รูปแบบ</th>
              <th>คะแนน</th>
              <th>เวลาที่ใช้</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {history?.quizzes.map(quiz => (
              <tr key={quiz._id}>
                <td>{formatDate(quiz.completedAt)}</td>
                <td>{quiz.subject.name}</td>
                <td>{quiz.examType.name}</td>
                <td>{quiz.score}/{quiz.totalQuestions}</td>
                <td>{formatTime(quiz.timeSpent)}</td>
                <td>
                  <Button onClick={() => viewQuizDetails(quiz._id)}>
                    ดูรายละเอียด
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

2. **หน้าแนะนำข้อสอบ**
```javascript
// components/QuizRecommendations.js
const QuizRecommendations = () => {
  const { data: recommendations } = useQuery(
    'recommendations',
    fetchRecommendations
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">แนะนำข้อสอบสำหรับคุณ</h2>

      <div className="grid grid-cols-3 gap-4">
        {recommendations?.map(rec => (
          <Card key={rec._id} className="p-4">
            <CardTitle>{rec.examType.name}</CardTitle>
            <CardDescription>
              เหมาะสำหรับระดับความสามารถของคุณ
            </CardDescription>
            <div className="mt-4">
              <Badge>{rec.difficulty}</Badge>
              <Badge>{rec.estimatedTime} นาที</Badge>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => startQuiz(rec.templateId)}
            >
              เริ่มทำข้อสอบ
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

### 19.5 การวิเคราะห์และแสดงผล

1. **การวิเคราะห์ความก้าวหน้า**
- ติดตามพัฒนาการของคะแนนตามเวลา
- วิเคราะห์จุดแข็ง-จุดอ่อนในแต่ละหัวข้อ
- แนะนำหัวข้อที่ควรทบทวน

2. **การแสดงผลแบบ Interactive**
- กราฟแสดงพัฒนาการ
- Heat map แสดงความถี่ในการทำข้อสอบ
- Radar chart แสดงความเชี่ยวชาญแต่ละด้าน