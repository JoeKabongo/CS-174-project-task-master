import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import mongoSanitize from 'express-mongo-sanitize'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import emailValidator from 'deep-email-validator'
import requireAuth from './authMiddleware.js'
import Task from './models/task.js'
import User from './models/user.js'
import { NOT_STARTED, IN_PROGRESS, COMPLETED } from './taskStatus.js'

const app = express()

// Configuring  cor and body parser middleware, for frontend request
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// To sanitize incoming request
app.use(mongoSanitize())

// Allow use access to .env file
dotenv.config()

const PORT = process.env.PORT || 5000

// Connect to mongoDB database
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
  )
  .catch((error) => console.log(error))

// Signup a user
app.post('/auth/signup', async (req, res) => {
  // Make sure all field required are provided
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Email, username and password are requried' })
  }

  // Make sure email is valid
  const { valid, reason, validators } = await isEmailValid(email)

  if (!valid) {
    return res.status(400).send({
      message: 'Please provide a valid email address.',
      reason: validators[reason].reason,
    })
  }

  try {
    // Make sure email isnt already in use
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User with email already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = new User({ name, email, password: hashedPassword })
    await user.save()
    return res.status(201).json({
      _id: user.id,
      username: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    return res.status(500).json({ message: 'Somethign went wrong' })
  }
})

// Login a user
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are requried' })
  }

  try {
    // check for user with email exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    // if password matches
    if (await bcrypt.compare(password, user.password)) {
      return res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      })
    }
    return res.status(400).json({ message: 'Email/password is incorrect' })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

// Get a user tasks
app.get('/tasks', requireAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    })
    return res.status(200).json({ tasks })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

// Create a new task for a user
app.post('/tasks', requireAuth, async (req, res) => {
  const { title } = req.body
  const newTask = new Task({
    title,
    user: req.user._id,
  })

  try {
    const result = await newTask.save()
    return res.status(200).json({ task: result })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

//  Update a task
app.put('/tasks/:id', requireAuth, async (req, res) => {
  const { title, status } = req.body
  const { id } = req.params

  // Make sure input is correct
  if (!title || ![NOT_STARTED, IN_PROGRESS, COMPLETED].includes(status)) {
    return res
      .status(400)
      .json({ message: 'Title or task status is incorrect' })
  }

  try {
    const newTask = await Task.findByIdAndUpdate(
      id,
      { title, status },
      { new: true }
    )

    if (!newTask) {
      return res.status(404).json({ message: 'This task was not found' })
    }

    return res.status(200).json({ task: newTask })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

// Delete a task
app.delete('/tasks/:id', requireAuth, async (req, res) => {
  const { id } = req.params
  try {
    const task = await Task.findByIdAndDelete(id)
    if (!task) {
      return res.status(404).json({ message: 'Task was not found' })
    }
    return res.status(200).json({ message: 'Task was deleted' })
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' })
  }
})

//Generate session token for user, when they login/sisgnup
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  })
}

const isEmailValid = (email) => {
  return emailValidator.validate(email)
}
