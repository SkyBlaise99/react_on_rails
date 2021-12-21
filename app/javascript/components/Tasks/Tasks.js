import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Tasks = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() =>
    axios.get('/api/v1/tasks')
      .then(resp => {
        setTasks(resp.data.data)
      })
      .catch(data => {
        debugger
      })
    , []
  )

  const taskList = tasks
    .map((task, index) =>
      (<li key={index} >{task.attributes.description}</li>)
    );

  return (
    <div className="home">
      <div className="header">
        <h1>Task Manager</h1>
      </div>

      <div className="search">
        Search bar goes here
      </div>

      <div className="list">
        <p>List of Tasks goes here ...</p>
        <ul>{taskList}</ul>
      </div>
    </div>
  )
}

export default Tasks
