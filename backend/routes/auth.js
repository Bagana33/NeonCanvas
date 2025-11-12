import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('email').isEmail().withMessage('Зөв имэйл оруулна уу'),
  body('password').isLength({ min: 6 }).withMessage('Нууц үг дор хаяж 6 тэмдэгт байна'),
  body('name').notEmpty().withMessage('Нэр шаардлагатай')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, name, role, avatar } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Энэ имэйл аль хэдийн бүртгэгдсэн байна' })
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      role: role || 'student',
      avatar: avatar || name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: 'Амжилттай бүртгэгдлээ',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Бүртгэл үүсгэхэд алдаа гарлаа' })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Зөв имэйл оруулна уу'),
  body('password').notEmpty().withMessage('Нууц үг шаардлагатай')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу байна' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Имэйл эсвэл нууц үг буруу байна' })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      message: 'Амжилттай нэвтэрлээ',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        points: user.points,
        rank: user.rank
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Нэвтрэхэд алдаа гарлаа' })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
import { authenticateToken } from '../middleware/auth.js'

router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ error: 'Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа' })
  }
})

export default router
