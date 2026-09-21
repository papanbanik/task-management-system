import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import AddTopic from './AddTopic/page'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/addtopic' element={<AddTopic/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App