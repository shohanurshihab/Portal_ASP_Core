import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import Profile from './components/Profile'
import Dash from './components/Dash'
import Documents from './components/Documents'

function App() {
  const [count, setCount] = useState(0)

  return ( 
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dash' element={<Dash />} />
        <Route path='/docs' element={<Documents />} />
        <Route path='/logout' element={<Logout />}/>
      </Routes>
    </Router>
  )
}

export default App
