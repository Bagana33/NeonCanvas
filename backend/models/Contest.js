import mongoose from 'mongoose'

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Гарчиг шаардлагатай'],
    trim: true
  },
  prize: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  announced: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Index for faster queries
contestSchema.index({ status: 1, createdAt: -1 })

export default mongoose.model('Contest', contestSchema)
