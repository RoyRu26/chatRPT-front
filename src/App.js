import { Routes, Route } from 'react-router-dom'
import LogIn from './components/LogIn'
import Register from './components/Register'
import { createContext, useEffect, useState } from 'react'
import HomePage from './components/HomePage'
import Chat from './components/Chat'
import CreateRoom from './components/CreateRoom'
import { io } from 'socket.io-client'
export const userInfo = createContext()
export const socket = io('http://localhost:2000')

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const contextValue = { user, setUser }
  useEffect(() => {
    socket.on('connection', () => console.log('connected'))
    return () => {
      socket.off('connection')
    }
  }, [])
  return (
    <userInfo.Provider value={contextValue}>
      <>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/HomePage' element={<HomePage />} />
          <Route path='/Chat' element={<Chat />} />
          <Route path='/CreateRoom' element={<CreateRoom />} />
        </Routes>
      </>
    </userInfo.Provider>
  );
}

export default App;
