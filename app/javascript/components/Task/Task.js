import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

const Task = () => {
  const [task, setTask] = useState(null)
  const [isInvalidId, setIsInvalidId] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    axios.get('/api/v1/tasks/' + id)
      .then(resp => { setTask(resp.data.data) })
      .catch(data => { setIsInvalidId(true) })
  }, [])

  if (isInvalidId) return <Navigate to="/" />

  if (task === null) return <h1>Loading ...</h1>

  return (
    <div className="home">
      <div className="header">
        <h1>Details of Task ID {task.id}</h1>
      </div>

      <div className="details">
        <p>Description: {task.attributes.description}</p>
        <p>Is done: {task.attributes.is_done ? "yes" : "nope"}</p>
        <p>Due date: {task.attributes.due_date}</p>
        <p>Created on: {task.attributes.created_at}</p>
        <p>Last edited on: {task.attributes.updated_at}</p>
      </div>

      <Link to={"/"}>Back</Link>
    </div>
  )
}

export default Task
