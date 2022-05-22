import React, { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { NOT_STARTED, IN_PROGRESS, COMPLETED } from '../constants'
import './task.css'

function TaskItem(props) {
  const { task, updateTask, deleteTask } = props
  const [editingTask, setEdingTask] = useState(task)
  const [isEditing, setIsEditing] = useState(false)

  const showEdit = () => {
    setIsEditing(true)
    setEdingTask(task)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const saveEdit = () => {
    setIsEditing(false)
    updateTask(editingTask)
  }

  const handleStatusChange = (event) => {
    setEdingTask({ ...editingTask, status: event.target.value })
  }

  const handleTitleChange = (event) => {
    setEdingTask({ ...editingTask, title: event.target.value })
  }

  const deleteCurrentTask = () => {
    deleteTask(task._id)
  }

  if (isEditing) {
    return (
      <div
        style={{ display: 'block', margin: '20px', backgroundColor: '#f5f5f5' }}
      >
        <form>
          <TextField
            label="title"
            variant="standard"
            style={{ display: 'block', margin: '10px', width: '100%' }}
            value={editingTask.title}
            onChange={handleTitleChange}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={editingTask.status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value={NOT_STARTED}>Not Started</MenuItem>
              <MenuItem value={IN_PROGRESS}>In Progress</MenuItem>
              <MenuItem value={COMPLETED}>Completed</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="primary"
            style={{ margin: '10px' }}
            onClick={saveEdit}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ margin: '10px' }}
            onClick={cancelEdit}
          >
            Cancel
          </Button>
        </form>
      </div>
    )
  }
  return (
    <div id="task-item">
      <div className="task-description">
        <p> {task.title}</p>
        <p className="task-status"> {task.status}</p>
      </div>
      <div>
        <EditIcon onClick={showEdit} />
        <DeleteIcon onClick={deleteCurrentTask} />
      </div>
    </div>
  )
}

export default TaskItem
