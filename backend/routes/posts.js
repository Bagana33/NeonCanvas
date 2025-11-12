import express from 'express'
import { body, validationResult } from 'express-validator'
import Post from '../models/Post.js'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { contestId, userId, limit = 50, skip = 0 } = req.query
    
    const query = {}
    if (contestId) query.contestId = contestId
    if (userId) query.userId = userId

    const posts = await Post.find(query)
      .populate('userId', 'name email avatar role')
      .populate('contestId', 'title prize')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))

    const total = await Post.countDocuments(query)

    res.json({
      posts,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ error: 'Постуудыг авахад алдаа гарлаа' })
  }
})

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'name email avatar role')
      .populate('contestId', 'title prize')
      .populate('comments.userId', 'name avatar')
      .populate('comments.replies.userId', 'name avatar')

    if (!post) {
      return res.status(404).json({ error: 'Пост олдсонгүй' })
    }

    res.json({ post })
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({ error: 'Пост авахад алдаа гарлаа' })
  }
})

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Гарчиг шаардлагатай')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, image, imageMeta, contestId, type } = req.body

    const post = new Post({
      userId: req.user._id,
      title,
      description,
      image,
      imageMeta,
      contestId: contestId || null,
      type: type || 'normal'
    })

    await post.save()
    await post.populate('userId', 'name email avatar role')

    res.status(201).json({
      message: 'Пост амжилттай үүслээ',
      post
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ error: 'Пост үүсгэхэд алдаа гарлаа' })
  }
})

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Пост олдсонгүй' })
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Танд энэ постыг засах эрх байхгүй' })
    }

    const { title, description, image, imageMeta } = req.body

    if (title) post.title = title
    if (description !== undefined) post.description = description
    if (image !== undefined) post.image = image
    if (imageMeta) post.imageMeta = imageMeta

    await post.save()
    await post.populate('userId', 'name email avatar role')

    res.json({
      message: 'Пост шинэчлэгдлээ',
      post
    })
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({ error: 'Пост шинэчлэхэд алдаа гарлаа' })
  }
})

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ error: 'Пост олдсонгүй' })
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Танд энэ постыг устгах эрх байхгүй' })
    }

    await post.deleteOne()

    res.json({ message: 'Пост амжилттай устгагдлаа' })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({ error: 'Пост устгахад алдаа гарлаа' })
  }
})

// @route   POST /api/posts/:id/react
// @desc    Add reaction to post
// @access  Private
router.post('/:id/react', authenticateToken, async (req, res) => {
  try {
    const { reaction } = req.body
    const validReactions = ['like', 'love', 'wow', 'fire', 'clap']

    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ error: 'Буруу reaction төрөл' })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Пост олдсонгүй' })
    }

    post.reactions[reaction] = (post.reactions[reaction] || 0) + 1
    await post.save()

    res.json({
      message: 'Reaction нэмэгдлээ',
      reactions: post.reactions,
      points: post.points
    })
  } catch (error) {
    console.error('React error:', error)
    res.status(500).json({ error: 'Reaction нэмэхэд алдаа гарлаа' })
  }
})

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', authenticateToken, [
  body('text').notEmpty().withMessage('Сэтгэгдэл хоосон байж болохгүй')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Пост олдсонгүй' })
    }

    const { text } = req.body

    post.comments.push({
      userId: req.user._id,
      text,
      reactions: { like: 0, love: 0 },
      replies: []
    })

    await post.save()
    await post.populate('comments.userId', 'name avatar')

    res.status(201).json({
      message: 'Сэтгэгдэл нэмэгдлээ',
      comments: post.comments
    })
  } catch (error) {
    console.error('Comment error:', error)
    res.status(500).json({ error: 'Сэтгэгдэл нэмэхэд алдаа гарлаа' })
  }
})

export default router
