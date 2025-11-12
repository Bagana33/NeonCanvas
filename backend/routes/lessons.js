import express from 'express'
import { body, validationResult } from 'express-validator'
import Lesson from '../models/Lesson.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/lessons
// @desc    Get all lessons
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, grade, limit = 50, skip = 0 } = req.query
    
    const query = {}
    if (subject) query.subject = subject
    if (grade) query.grade = grade

    const lessons = await Lesson.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Lesson.countDocuments(query)

    res.json({
      lessons,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    })
  } catch (error) {
    console.error('Get lessons error:', error)
    res.status(500).json({ error: 'Хичээлүүдийг авахад алдаа гарлаа' })
  }
})

// @route   GET /api/lessons/:id
// @desc    Get single lesson
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('attempts.userId', 'name avatar')

    if (!lesson) {
      return res.status(404).json({ error: 'Хичээл олдсонгүй' })
    }

    res.json({ lesson })
  } catch (error) {
    console.error('Get lesson error:', error)
    res.status(500).json({ error: 'Хичээл авахад алдаа гарлаа' })
  }
})

// @route   POST /api/lessons
// @desc    Create new lesson
// @access  Private (Teacher/Admin)
router.post('/', authenticateToken, requireRole('teacher', 'admin'), [
  body('title').notEmpty().withMessage('Гарчиг шаардлагатай')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, subject, grade, teacher, description, files, quiz } = req.body

    const lesson = new Lesson({
      title,
      subject,
      grade,
      teacher,
      description,
      files: files || [],
      quiz: quiz || []
    })

    await lesson.save()

    res.status(201).json({
      message: 'Хичээл амжилттай үүслээ',
      lesson
    })
  } catch (error) {
    console.error('Create lesson error:', error)
    res.status(500).json({ error: 'Хичээл үүсгэхэд алдаа гарлаа' })
  }
})

// @route   PUT /api/lessons/:id
// @desc    Update lesson
// @access  Private (Teacher/Admin)
router.put('/:id', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)

    if (!lesson) {
      return res.status(404).json({ error: 'Хичээл олдсонгүй' })
    }

    const { title, subject, grade, teacher, description, files, quiz } = req.body

    if (title) lesson.title = title
    if (subject !== undefined) lesson.subject = subject
    if (grade !== undefined) lesson.grade = grade
    if (teacher !== undefined) lesson.teacher = teacher
    if (description !== undefined) lesson.description = description
    if (files) lesson.files = files
    if (quiz) lesson.quiz = quiz

    await lesson.save()

    res.json({
      message: 'Хичээл шинэчлэгдлээ',
      lesson
    })
  } catch (error) {
    console.error('Update lesson error:', error)
    res.status(500).json({ error: 'Хичээл шинэчлэхэд алдаа гарлаа' })
  }
})

// @route   DELETE /api/lessons/:id
// @desc    Delete lesson
// @access  Private (Teacher/Admin)
router.delete('/:id', authenticateToken, requireRole('teacher', 'admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id)

    if (!lesson) {
      return res.status(404).json({ error: 'Хичээл олдсонгүй' })
    }

    res.json({ message: 'Хичээл устгагдлаа' })
  } catch (error) {
    console.error('Delete lesson error:', error)
    res.status(500).json({ error: 'Хичээл устгахад алдаа гарлаа' })
  }
})

// @route   POST /api/lessons/:id/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)

    if (!lesson) {
      return res.status(404).json({ error: 'Хичээл олдсонгүй' })
    }

    const { answers } = req.body // answers should be an array of user answers

    let score = 0
    let total = 0

    lesson.quiz.forEach((question, index) => {
      const userAnswer = answers[index]
      const points = question.points || 10
      total += points

      if (question.type === 'mc') {
        if (parseInt(userAnswer) === question.correct) {
          score += points
        }
      } else if (question.type === 'tf') {
        if (userAnswer === question.answer) {
          score += points
        }
      } else if (question.type === 'sa') {
        if (userAnswer?.toLowerCase().trim() === String(question.answer).toLowerCase().trim()) {
          score += points
        }
      }
    })

    // Save attempt
    lesson.attempts.push({
      userId: req.user._id,
      score,
      total
    })

    await lesson.save()

    res.json({
      message: 'Quiz амжилттай хийгдлээ',
      score,
      total,
      percentage: Math.round((score / total) * 100)
    })
  } catch (error) {
    console.error('Submit quiz error:', error)
    res.status(500).json({ error: 'Quiz шалгахад алдаа гарлаа' })
  }
})

export default router
