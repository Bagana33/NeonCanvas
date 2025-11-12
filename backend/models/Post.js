import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Гарчиг шаардлагатай'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: null
  },
  imageMeta: {
    width: Number,
    height: Number
  },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    fire: { type: Number, default: 0 },
    clap: { type: Number, default: 0 }
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 }
    },
    replies: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: String,
      reactions: {
        like: { type: Number, default: 0 }
      },
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    default: null
  },
  type: {
    type: String,
    enum: ['normal', 'contest_announcement'],
    default: 'normal'
  }
}, {
  timestamps: true
})

// Index for faster queries
postSchema.index({ userId: 1, createdAt: -1 })
postSchema.index({ contestId: 1 })

// Virtual for calculating points
postSchema.virtual('points').get(function() {
  const weights = { like: 1, love: 2, wow: 1.5, fire: 2.5, clap: 1 }
  let total = 0
  for (const [reaction, count] of Object.entries(this.reactions)) {
    total += (weights[reaction] || 1) * count
  }
  return Math.round(total * 10) / 10
})

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Post', postSchema)
