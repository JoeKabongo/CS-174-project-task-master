import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/signup'
import HomePage from './pages/home'
import LoginPage from './pages/login'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/signup" element={<SignupPage />} />
          <Route exact path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
