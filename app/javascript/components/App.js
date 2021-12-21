import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Tasks from './Tasks/Tasks'
import Task from './Task/Task'

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
