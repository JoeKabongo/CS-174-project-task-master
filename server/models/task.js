import mongoose from 'mongoose'
import { NOT_STARTED, IN_PROGRESS, COMPLETED } from '../taskStatus.js'

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [NOT_STARTED, IN_PROGRESS, COMPLETED],
      required: true,
      default: NOT_STARTED,
    },
  },
  { timestamps: true }
)

const Task = mongoose.model('Task', taskSchema)

export default Task
