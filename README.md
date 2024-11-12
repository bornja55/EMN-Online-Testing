# EMN Online Testing (English Mania Online Testing)

ระบบทดสอบออนไลน์สำหรับการเรียนการสอนภาษาอังกฤษ

## 📋 รายละเอียดโครงการ

EMN Online Testing เป็นแพลตฟอร์มสำหรับการทดสอบภาษาอังกฤษออนไลน์ที่ช่วยให้ผู้สอนสามารถสร้างแบบทดสอบ และผู้เรียนสามารถทำแบบทดสอบได้อย่างมีประสิทธิภาพ

### คุณสมบัติหลัก
- 📝 สร้างและจัดการแบบทดสอบ
- 👥 ระบบจัดการผู้ใช้หลายระดับ
- 📊 รายงานผลการทดสอบ
- 🔄 ระบบติดตามความก้าวหน้า
- 🔒 ระบบรักษาความปลอดภัย

## 🚀 การติดตั้ง

### ความต้องการของระบบ
- Node.js (v14.0.0 หรือสูงกว่า)
- MongoDB (v4.0.0 หรือสูงกว่า)
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. Clone repository:


bash

Backend
npm run dev

Frontend
npm run dev


## 🏗️ โครงสร้างโปรเจค

EMNOnlineTesting/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
└── frontend/
├── components/
├── pages/
├── public/
└── styles/

## 🔧 การใช้งาน API

### Authentication
- POST `/api/auth/register` - ลงทะเบียนผู้ใช้ใหม่
- POST `/api/auth/login` - เข้าสู่ระบบ
- POST `/api/auth/logout` - ออกจากระบบ

### Quiz
- GET `/api/quiz` - ดึงรายการแบบทดสอบ
- POST `/api/quiz/create` - สร้างแบบทดสอบใหม่
- GET `/api/quiz/:id` - ดึงข้อมูลแบบทดสอบ
- PUT `/api/quiz/:id` - อัพเดตแบบทดสอบ
- DELETE `/api/quiz/:id` - ลบแบบทดสอบ

## 👥 บทบาทผู้ใช้

1. **ผู้ดูแลระบบ (Admin)**
   - จัดการผู้ใช้ทั้งหมด
   - จัดการการตั้งค่าระบบ

2. **ผู้สอน (Teacher)**
   - สร้างและจัดการแบบทดสอบ
   - ดูผลการทดสอบ

3. **ผู้เรียน (Student)**
   - ทำแบบทดสอบ
   - ดูผลการทดสอบของตนเอง

## 🔒 ความปลอดภัย

- การเข้ารหัส JWT
- การป้องกัน XSS และ CSRF
- การจำกัดการเข้าถึง API
- การเข้ารหัสรหัสผ่าน

## 🤝 การมีส่วนร่วม

หากคุณต้องการมีส่วนร่วมในการพัฒนา:
1. Fork repository
2. สร้าง branch ใหม่
3. Commit การเปลี่ยนแปลง
4. Push to branch
5. สร้าง Pull Request

## 📝 License

โครงการนี้อยู่ภายใต้ลิขสิทธิ์ MIT License - ดูรายละเอียดเพิ่มเติมที่ [LICENSE](LICENSE)