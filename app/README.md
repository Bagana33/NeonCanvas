# NeonCanvas - React Frontend# NeonCanvas React App



NeonCanvas дизайн сургалтын платформын React + TypeScript + Tailwind CSS frontend.Shine folder deer React + TypeScript + Tailwind CSS ashiglaj bichsen NeonCanvas app.



## Онцлогууд## Ажиллуулах



- ✨ React 18 + TypeScript```bash

- 🎨 Tailwind CSS (Neon gradient дизайн)cd app

- 🔐 JWT Authenticationnpm install

- 📱 Responsive дизайнnpm run dev

- ⚡ Vite build tool```

- 🗺️ React Router navigation

## Тайлбар

## Суулгах

- **React 18** - UI framework

### 1. Dependencies суулгах- **TypeScript** - Type safety

- **Tailwind CSS** - Styling

```bash- **Vite** - Build tool

cd app- **React Router** - Navigation

npm install- **Supabase** - Authentication болон backend

```

## Хуудсууд

### 2. Environment тохируулах

- `/` - Home (posts feed)

`.env.example`-г `.env` болгож хуулаад өөрчилнө:- `/login` - Login/Signup

- `/dashboard` - Dashboard (teacher/admin)

```bash- `/leaderboard` - Leaderboard

cp .env.example .env- `/map` - Design map

```- `/profile` - User profile

- `/lessons` - Lessons

`.env` файлд backend URL-аа оруулна:

## Build

```env

VITE_API_URL=http://localhost:5000/api```bash

```npm run build

```

### 3. Ажиллуулах

Build хийсний дараа `dist/` folder үүснэ. Үүнийг хаана ч deploy хийж болно.

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Бүтэц

```
app/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main app with routing
│   ├── styles.css            # Global styles + Tailwind
│   ├── vite-env.d.ts         # TypeScript types
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state
│   ├── lib/
│   │   └── api.ts            # API client for backend
│   ├── components/
│   │   └── Layout.tsx        # Main layout with nav
│   └── pages/
│       ├── HomePage.tsx      # Feed with posts
│       ├── LoginPage.tsx     # Login/Register
│       ├── DashboardPage.tsx # Stats dashboard
│       ├── LeaderboardPage.tsx # Rankings
│       ├── ProfilePage.tsx   # User profile
│       ├── LessonsPage.tsx   # Lessons list
│       └── MapPage.tsx       # Contests map
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Хуудсууд

### 🏠 Home (`/`)
Бүх постуудын feed, reactions, points тооцоолох

### 🔐 Login (`/login`)
Нэвтрэх/Бүртгүүлэх хуудас

### 📊 Dashboard (`/dashboard`)
Багш/админы статистик хуудас

### 🏆 Leaderboard (`/leaderboard`)
Хэрэглэгчдийн рейтинг

### 👤 Profile (`/profile`)
Хэрэглэгчийн профайл, статистик

### 📚 Lessons (`/lessons`)
Хичээлүүд, quiz-ууд

### 🗺️ Map (`/map`)
Тэмцээн, challenge-ууд

## API Integration

Backend-тай холбогдох `src/lib/api.ts` файл ашигладаг:

```typescript
import { api } from '../lib/api'

// Posts
const posts = await api.posts.getAll()
const post = await api.posts.getById(id)

// Auth
const user = await api.auth.login({ email, password })
const me = await api.auth.getMe(token)

// Leaderboard
const leaders = await api.users.getLeaderboard(10)

// Lessons
const lessons = await api.lessons.getAll({})
```

## Authentication

JWT token localStorage-д хадгалагддаг:

```typescript
// Login
const { token, user } = await api.auth.login({ email, password })
localStorage.setItem('token', token)

// Protected routes
const token = localStorage.getItem('token')
```

## Дизайн систем

Tailwind CSS custom theme ашигладаг (`tailwind.config.js`):

- **Colors**: Neon purple/pink/cyan gradients
- **Components**: Glass morphism, neon shadows
- **Typography**: JetBrains Mono font

```css
/* Custom classes */
.bg-gradient-neon     /* Purple to pink gradient */
.shadow-neon          /* Glowing shadow */
.bg-panel             /* Glass panel background */
.text-accent          /* Accent color */
```

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Backend холбох

1. Backend server ажиллуулах (port 5000)
2. Frontend dev server ажиллуулах (port 5173)
3. `.env` файлд `VITE_API_URL=http://localhost:5000/api` байгаа эсэхийг шалгах

## Deployment

### Build

```bash
npm run build
```

`dist/` folder үүснэ.

### Static hosting (Vercel, Netlify)

1. GitHub repository холбох
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_URL` backend URL оруулах

## Хөгжүүлэлт

TypeScript strict mode асаалттай, lint errors автоматаар харагдана.

Protected route нэмэх:

```tsx
// App.tsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>
```

## Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast HMR)
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **JWT** - Authentication tokens
