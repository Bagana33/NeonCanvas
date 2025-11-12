import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Гарчиг шаардлагатай'],
    trim: true
  },
  subject: {
    type: String,
    default: ''
  },
  grade: {
    type: String,
    default: ''
  },
  teacher: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  files: [{
    name: String,
    size: Number,
    mime: String,
    dataUrl: String,
    href: String,
    ephemeral: { type: Boolean, default: false }
  }],
  quiz: [{
    type: {
      type: String,
      enum: ['mc', 'tf', 'sa'],
      required: true
    },
    question: {
      type: String,
      required: true
    },
    // For multiple choice
    options: [String],
    correct: Number,
    // For true/false
    answer: mongoose.Schema.Types.Mixed,
    points: {
      type: Number,
      default: 10
    }
  }],
  attempts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: Number,
    total: Number,
    completedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
})

// Index for faster queries
lessonSchema.index({ subject: 1, grade: 1 })

export default mongoose.model('Lesson', lessonSchema)
