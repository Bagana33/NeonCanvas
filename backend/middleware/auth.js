import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token шаардлагатай' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Буруу token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token-ий хугацаа дууссан' })
    }
    res.status(500).json({ error: 'Token шалгахад алдаа гарлаа' })
  }
}

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Нэвтрэх шаардлагатай' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Танд энэ үйлдэл хийх эрх байхгүй',
        requiredRoles: roles,
        yourRole: req.user.role
      })
    }

    next()
  }
}
