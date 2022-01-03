import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Tasks from './Tasks'
import Task from './Task'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Tasks />} />
        <Route exact path="/:id" element={<Task />} />
      </Routes>
    </Router>
  )
}

export default App
