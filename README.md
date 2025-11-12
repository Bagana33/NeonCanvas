# 🎨 NeonCanvas

Дизайн сургалтын интерактив платформ - React + MongoDB full-stack application.

## 📋 Тойм

NeonCanvas нь дизайн сургалт явуулах, ажлаа хуваалцах, тэмцээнд оролцох боломжтой платформ юм. Сурагчид дизайн хийж оноо цуглуулж, рейтингээ өсгөх боломжтой.

### Онцлогууд

- 🎨 **Пост хуваалцах**: Дизайнаа оруулж оноо цуглуулах
- 👍 **Reactions**: Like, Love, Wow, Fire, Clap
- 🏆 **Leaderboard**: Оноогоор эрэмбэлэгдсэн рейтинг
- 📚 **Хичээлүүд**: Quiz-тэй хичээлүүд
- 🗺️ **Тэмцээнүүд**: Design challenge-үүд
- 👤 **Profile**: Хэрэглэгчийн статистик, rank
- 📊 **Dashboard**: Багш/админы статистик

## 🏗️ Технологи

### Frontend (/app)
- React 18 + TypeScript
- Tailwind CSS (Neon gradient дизайн)
- Vite (build tool)
- React Router (routing)
- JWT authentication

### Backend (/backend)
- Node.js + Express.js
- MongoDB + Mongoose
- JWT tokens
- bcryptjs (password hashing)

## 🚀 Суулгах

### 1. MongoDB суулгах/ажиллуулах

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Linux:**
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

### 2. Backend суулгах

```bash
cd backend
npm install
cp .env.example .env
```

`.env` файл засварлах:
```env
MONGODB_URI=mongodb://localhost:27017/neoncanvas
JWT_SECRET=your-random-secret-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Backend ажиллуулах:
```bash
npm start
```

### 3. Frontend суулгах

Шинэ terminal нээж:

```bash
cd app
npm install
cp .env.example .env
```

`.env` файл засварлах:
```env
VITE_API_URL=http://localhost:5000/api
```

Frontend ажиллуулах:
```bash
npm run dev
```

App `http://localhost:5173` дээр ажиллана.

## 📁 Бүтэц

```
NeonCanvas/
├── app/           # React frontend
├── backend/       # Express.js API
└── README.md      # Энэ файл
```

Дэлгэрэнгүй мэдээлэл:
- Frontend: `app/README.md`
- Backend: `backend/README.md`

## 🔑 API Endpoints

- `POST /api/auth/register` - Бүртгүүлэх
- `POST /api/auth/login` - Нэвтрэх
- `GET /api/posts` - Бүх постууд
- `GET /api/users/leaderboard` - Leaderboard
- `GET /api/lessons` - Хичээлүүд
- `GET /api/contests` - Тэмцээнүүд

Бүрэн жагсаалт: `backend/README.md`

## 🎨 Дизайн

Neon gradient theme - Purple/Pink/Cyan, Glass morphism UI

## 👨‍💻 Author

Developed with ❤️ for design education
