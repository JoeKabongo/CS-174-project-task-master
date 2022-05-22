import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Cookies from 'js-cookie'

import axios from '../api'
import Task from '../components/task'

function HomePage() {
  let navigate = useNavigate()

  // User is not logged in, go to login page
  if (!Cookies.get('token')) {
    navigate('/login')
  }

  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const config = {
    headers: {
      'x-access-token': Cookies.get('token'),
    },
  }

  useEffect(() => {
    document.title = 'Home'

    // Get user tasks when page loads
    const fetchData = async () => {
      try {
        const response = await axios.get('tasks', config)
        setTasks(response.data.tasks)
      } catch (e) {
        const errorMessage =
          e.response.data.message || 'Something went wrong, sorry!'
        setErrorMessage(errorMessage)
      }
    }

    fetchData()
    setIsLoading(false)
  }, [])

  const updateTask = async (newTask) => {
    try {
      await axios.put(`tasks/${newTask._id}`, newTask, config)
      const newTasks = tasks.map((task) =>
        newTask._id === task._id ? newTask : task
      )
      setTasks(newTasks)
    } catch (e) {
      const errorMessage =
        e.response.data.message || 'Something went wrong, sorry!'
      setErrorMessage(errorMessage)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`tasks/${id}`, config)
      const newTasks = tasks.filter((task) => task._id !== id)
      setTasks(newTasks)
    } catch (e) {
      const errorMessage =
        e.response.data.message || 'Something went wrong, sorry!'
      setErrorMessage(errorMessage)
    }
  }

  const createTask = async () => {
    if (!newTask) {
      setErrorMessage('Task cannot be empty')
      return
    }
    try {
      const result = await axios.post('tasks', { title: newTask }, config)
      const task = result.data.task
      const newTasks = [task, ...tasks]
      setTasks(newTasks)
      setNewTask('')
    } catch (e) {
      const errorMessage =
        e.response.data.message || 'Something went wrong, sorry!'
      setErrorMessage(errorMessage)
    }
  }

  const handleTaskInputChange = async (e) => {
    setNewTask(e.target.value)
  }

  const logout = () => {
    Cookies.remove('token')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      <section style={{ textAlign: 'center' }}>
        <h1> Task Master</h1>
        <Button
          variant="outlined"
          color="primary"
          style={{ margin: '5px' }}
          onClick={logout}
        >
          Logout
        </Button>
        {errorMessage && (
          <Stack sx={{ width: '90%', margin: '20px' }} spacing={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Stack>
        )}
      </section>

      <section style={{ width: '90%', margin: '10px' }}>
        <TextField
          id="standard-basic"
          label="New Task"
          variant="standard"
          value={newTask}
          onChange={handleTaskInputChange}
          fullWidth
        />
        <Button
          variant="outlined"
          color="primary"
          style={{ margin: '10px' }}
          onClick={createTask}
        >
          Add
        </Button>
      </section>

      <section>
        {tasks.map((task) => (
          <Task
            task={task}
            key={task._id}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </section>
    </div>
  )
}

export default HomePage
