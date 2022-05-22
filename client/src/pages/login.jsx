import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import API from '../api'

function LoginPage() {
  let navigate = useNavigate()

  document.title = 'Login'

  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
  })

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = inputValues

    // Make sure user inputed field
    if (!email || !password) {
      setErrorMessage('All fields are required')
      return
    }

    // Login user
    try {
      const { email, password } = inputValues
      const response = await API.post('auth/login', {
        email,
        password,
      })
      Cookies.set('token', response.data.token)
      navigate('/')
    } catch (e) {
      const errorMessage =
        e.response.data.message || 'Something went wrong, sorry!'
      setErrorMessage(errorMessage)
    }
  }

  const handleChange = (param) => (e) => {
    setInputValues({ ...inputValues, [param]: e.target.value })
    setErrorMessage('')
  }

  return (
    <section style={{ display: 'block', width: '400px' }}>
      <h1 style={{ display: 'block', margin: '20px' }}> Login </h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          style={{ display: 'block', margin: '20px' }}
          onChange={handleChange('email')}
          value={inputValues.email}
          required
          fullWidth
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          style={{ display: 'block', margin: '20px' }}
          onChange={handleChange('password')}
          value={inputValues.password}
          required
          fullWidth
        />
        {errorMessage && (
          <Stack sx={{ width: '100%', margin: '20px' }} spacing={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Stack>
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ display: 'block', margin: '20px' }}
        >
          Login
        </Button>

        <p style={{ display: 'block', margin: '20px' }}>
          Do not have an account? <Link to="/signup"> Signup</Link>
        </p>
      </form>
    </section>
  )
}

export default LoginPage
