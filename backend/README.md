# NeonCanvas Backend API

MongoDB ашиглан бичсэн Express.js REST API.

## Суулгах

```bash
cd backend
npm install
```

## MongoDB тохируулах

### Option 1: Local MongoDB

```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt install mongodb
sudo systemctl start mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) дээр бүртгүүлэх
2. Cluster үүсгэх (Free tier хүрэлцэнэ)
3. Connection string авах
4. `.env` файлд оруулах

## Environment Variables

`.env.example`-г `.env` болгож хуулаад өөрчилнө:

```bash
cp .env.example .env
```

`.env` файлд дараах утгуудыг оруулна:

```env
MONGODB_URI=mongodb://localhost:27017/neoncanvas
PORT=5000
JWT_SECRET=your-random-secret-key-here
FRONTEND_URL=http://localhost:3000
```

## Ажиллуулах

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Server `http://localhost:5000` дээр ажиллана.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Шинэ хэрэглэгч бүртгүүлэх
- `POST /api/auth/login` - Нэвтрэх
- `GET /api/auth/me` - Одоогийн хэрэглэгч авах

### Posts
- `GET /api/posts` - Бүх постууд
- `GET /api/posts/:id` - Нэг пост
- `POST /api/posts` - Шинэ пост үүсгэх (🔒)
- `PUT /api/posts/:id` - Пост засах (🔒)
- `DELETE /api/posts/:id` - Пост устгах (🔒)
- `POST /api/posts/:id/react` - Reaction нэмэх (🔒)
- `POST /api/posts/:id/comment` - Сэтгэгдэл нэмэх (🔒)

### Users
- `GET /api/users` - Бүх хэрэглэгчид (🔒 Teacher/Admin)
- `GET /api/users/leaderboard` - Leaderboard
- `GET /api/users/:id` - Хэрэглэгчийн мэдээлэл
- `PUT /api/users/:id` - Профайл засах (🔒)
- `PUT /api/users/:id/role` - Role солих (🔒 Admin)

### Lessons
- `GET /api/lessons` - Бүх хичээлүүд
- `GET /api/lessons/:id` - Нэг хичээл
- `POST /api/lessons` - Шинэ хичээл үүсгэх (🔒 Teacher/Admin)
- `PUT /api/lessons/:id` - Хичээл засах (🔒 Teacher/Admin)
- `DELETE /api/lessons/:id` - Хичээл устгах (🔒 Teacher/Admin)
- `POST /api/lessons/:id/submit` - Quiz хариулт илгээх (🔒)

### Contests
- `GET /api/contests` - Бүх тэмцээнүүд
- `GET /api/contests/:id` - Нэг тэмцээн
- `POST /api/contests` - Шинэ тэмцээн үүсгэх (🔒 Teacher/Admin)
- `PUT /api/contests/:id` - Тэмцээн засах (🔒 Teacher/Admin)
- `DELETE /api/contests/:id` - Тэмцээн устгах (🔒 Teacher/Admin)
- `POST /api/contests/:id/toggle` - Статус солих (🔒 Teacher/Admin)
- `POST /api/contests/:id/join/:postId` - Тэмцээнд орох (🔒)

🔒 = Authentication шаардлагатай

## Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## Database Models

- **User**: Хэрэглэгчийн мэдээлэл, points, rank
- **Post**: Дизайн пост, reactions, comments
- **Lesson**: Хичээл, files, quiz
- **Contest**: Тэмцээн, entries, status

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- express-validator
