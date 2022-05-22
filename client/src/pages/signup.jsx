import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import API from '../api'

function SignupPage() {
  let navigate = useNavigate()

  document.title = 'Signup'

  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [errorMessage, setErrorMessage] = useState('')

  // Submit signup form
  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, password } = inputValues

    // Make sure all fields are not empty
    if (!name && !email && !password) {
      setErrorMessage('All fields are required!')
      return
    }

    // Make sure password is long enought
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 character long')
      return
    }

    try {
      // Signup  user and redirect to home page
      const response = await API.post('auth/signup', {
        name,
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
    <section>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'block', width: '500px' }}
      >
        <h1 style={{ display: 'block', margin: '20px' }}> Signup </h1>

        <TextField
          label="name"
          variant="outlined"
          style={{ display: 'block', margin: '20px' }}
          onChange={handleChange('name')}
          value={inputValues.name}
          required
          fullWidth
        />
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
          Signup
        </Button>

        <p style={{ display: 'block', margin: '20px' }}>
          Have an account already? <Link to="/login"> Login Here</Link>
        </p>
      </form>
    </section>
  )
}

export default SignupPage
