import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import lessonRoutes from './routes/lessons.js'
import contestRoutes from './routes/contests.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neoncanvas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB холбогдлоо')
  } catch (error) {
    console.error('❌ MongoDB холбогдох алдаа:', error.message)
    process.exit(1)
  }
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/contests', contestRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NeonCanvas API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} дээр ажиллаж байна`)
  })
}

startServer()
