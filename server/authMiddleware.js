import jwt from 'jsonwebtoken'
import User from './models/user.js'

const requiresAuth = async (req, res, next) => {
  const token = req.headers['x-access-token']
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return res.status(404).json({
      message: 'Your are not authorized!',
    })
  }
}

export default requiresAuth
