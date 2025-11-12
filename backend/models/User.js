import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email шаардлагатай'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Зөв имэйл оруулна уу']
  },
  password: {
    type: String,
    required: [true, 'Нууц үг шаардлагатай'],
    minlength: [6, 'Нууц үг дор хаяж 6 тэмдэгт байх ёстой']
  },
  name: {
    type: String,
    required: [true, 'Нэр шаардлагатай'],
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  avatarImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  points: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Novice Spark'
  },
  supabaseId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model('User', userSchema)
