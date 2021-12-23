import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import axios from 'axios'

function filterTaskList(taskList, query) {
  return query
    ? taskList.filter((task) => task.attributes.description.toLowerCase().includes(query))
    : taskList;
}

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [referesh, setReferesh] = useState(false)

  const fetchData = () => {
    axios.get('/api/v1/tasks/')
      .then(resp => { setTasks(resp.data.data) })
      .catch(data => { debugger })
  }

  useEffect(fetchData, [])

  useEffect(() => {
    fetchData()
    setReferesh(false)
  }, [referesh])

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete('/api/v1/tasks/' + id)
        .then(() => setReferesh(true))
    }
  }

  const formattedTaskList = filterTaskList(tasks, searchQuery).map((task, index) => (
    <li key={index} >
      <Link to={"/" + task.id}>{task.attributes.description}</Link>
      <b> | </b>
      {task.attributes.is_done ? "done" : "not done"}
      <b> | </b>
      {task.attributes.due_date}
      <b> | </b>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  ));

  return (
    <div className="home">
      <div className="header">
        <h1>Sora</h1>
        <p>Your number 1 task manager</p>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search for your task :)"
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="list">
        <p>List of Tasks</p>
        <ul>{formattedTaskList}</ul>
      </div>
    </div>
  )
}

export default Tasks
