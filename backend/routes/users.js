import express from 'express'
import User from '../models/User.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Teacher/Admin)
router.get('/', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query

    const users = await User.find()
      .select('-password')
      .sort({ points: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await User.countDocuments()

    res.json({
      users,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Хэрэглэгчид авахад алдаа гарлаа' })
  }
})

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard (top users by points)
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const users = await User.find()
      .select('-password')
      .sort({ points: -1 })
      .limit(parseInt(limit))

    res.json({ users })
  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ error: 'Leaderboard авахад алдаа гарлаа' })
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Хэрэглэгч авахад алдаа гарлаа' })
  }
})

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Танд энэ хэрэглэгчийг засах эрх байхгүй' })
    }

    const { name, bio, avatar, avatarImage } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (avatar) updateData.avatar = avatar
    if (avatarImage !== undefined) updateData.avatarImage = avatarImage

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    res.json({
      message: 'Профайл шинэчлэгдлээ',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Хэрэглэгч шинэчлэхэд алдаа гарлаа' })
  }
})

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/:id/role', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body
    const validRoles = ['student', 'teacher', 'admin']

    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Буруу role төрөл' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    res.json({
      message: 'Role шинэчлэгдлээ',
      user
    })
  } catch (error) {
    console.error('Update role error:', error)
    res.status(500).json({ error: 'Role шинэчлэхэд алдаа гарлаа' })
  }
})

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    res.json({ message: 'Хэрэглэгч устгагдлаа' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'Хэрэглэгч устгахад алдаа гарлаа' })
  }
})

export default router
