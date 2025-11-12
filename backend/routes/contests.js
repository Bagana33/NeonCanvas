import express from 'express'
import { body, validationResult } from 'express-validator'
import Contest from '../models/Contest.js'
import Post from '../models/Post.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/contests
// @desc    Get all contests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, skip = 0 } = req.query
    
    const query = {}
    if (status) query.status = status

    const contests = await Contest.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Contest.countDocuments(query)

    res.json({
      contests,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    })
  } catch (error) {
    console.error('Get contests error:', error)
    res.status(500).json({ error: 'Тэмцээнүүдийг авахад алдаа гарлаа' })
  }
})

// @route   GET /api/contests/:id
// @desc    Get single contest with entries
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate({
        path: 'entries',
        populate: { path: 'userId', select: 'name avatar' }
      })

    if (!contest) {
      return res.status(404).json({ error: 'Тэмцээн олдсонгүй' })
    }

    res.json({ contest })
  } catch (error) {
    console.error('Get contest error:', error)
    res.status(500).json({ error: 'Тэмцээн авахад алдаа гарлаа' })
  }
})

// @route   POST /api/contests
// @desc    Create new contest
// @access  Private (Teacher/Admin)
router.post('/', authenticateToken, requireRole('teacher', 'admin'), [
  body('title').notEmpty().withMessage('Гарчиг шаардлагатай')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, prize, description, announced } = req.body

    const contest = new Contest({
      title,
      prize,
      description,
      announced: announced || false
    })

    await contest.save()

    res.status(201).json({
      message: 'Тэмцээн амжилттай үүслээ',
      contest
    })
  } catch (error) {
    console.error('Create contest error:', error)
    res.status(500).json({ error: 'Тэмцээн үүсгэхэд алдаа гарлаа' })
  }
})

// @route   PUT /api/contests/:id
// @desc    Update contest
// @access  Private (Teacher/Admin)
router.put('/:id', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)

    if (!contest) {
      return res.status(404).json({ error: 'Тэмцээн олдсонгүй' })
    }

    const { title, prize, description, status, announced } = req.body

    if (title) contest.title = title
    if (prize !== undefined) contest.prize = prize
    if (description !== undefined) contest.description = description
    if (status) contest.status = status
    if (announced !== undefined) contest.announced = announced

    await contest.save()

    res.json({
      message: 'Тэмцээн шинэчлэгдлээ',
      contest
    })
  } catch (error) {
    console.error('Update contest error:', error)
    res.status(500).json({ error: 'Тэмцээн шинэчлэхэд алдаа гарлаа' })
  }
})

// @route   DELETE /api/contests/:id
// @desc    Delete contest
// @access  Private (Teacher/Admin)
router.delete('/:id', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id)

    if (!contest) {
      return res.status(404).json({ error: 'Тэмцээн олдсонгүй' })
    }

    res.json({ message: 'Тэмцээн устгагдлаа' })
  } catch (error) {
    console.error('Delete contest error:', error)
    res.status(500).json({ error: 'Тэмцээн устгахад алдаа гарлаа' })
  }
})

// @route   POST /api/contests/:id/toggle
// @desc    Toggle contest status (open/closed)
// @access  Private (Teacher/Admin)
router.post('/:id/toggle', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)

    if (!contest) {
      return res.status(404).json({ error: 'Тэмцээн олдсонгүй' })
    }

    contest.status = contest.status === 'open' ? 'closed' : 'open'
    await contest.save()

    res.json({
      message: `Тэмцээн ${contest.status === 'open' ? 'нээгдлээ' : 'хаагдлаа'}`,
      contest
    })
  } catch (error) {
    console.error('Toggle contest error:', error)
    res.status(500).json({ error: 'Тэмцээн toggle хийхэд алдаа гарлаа' })
  }
})

// @route   POST /api/contests/:id/join/:postId
// @desc    Join contest with a post
// @access  Private
router.post('/:id/join/:postId', authenticateToken, async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
    const post = await Post.findById(req.params.postId)

    if (!contest) {
      return res.status(404).json({ error: 'Тэмцээн олдсонгүй' })
    }

    if (!post) {
      return res.status(404).json({ error: 'Пост олдсонгүй' })
    }

    if (contest.status !== 'open') {
      return res.status(400).json({ error: 'Тэмцээн хаагдсан байна' })
    }

    // Check if post already in entries
    if (contest.entries.includes(post._id)) {
      return res.status(400).json({ error: 'Энэ пост аль хэдийн тэмцээнд орсон байна' })
    }

    contest.entries.push(post._id)
    await contest.save()

    res.json({
      message: 'Тэмцээнд амжилттай орлоо',
      contest
    })
  } catch (error) {
    console.error('Join contest error:', error)
    res.status(500).json({ error: 'Тэмцээнд орохд алдаа гарлаа' })
  }
})

export default router
