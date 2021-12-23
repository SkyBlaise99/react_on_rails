import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { BrowserRouter as Router, Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

const Task = () => {
  const [task, setTask] = useState(null)
  const [isInvalidId, setIsInvalidId] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { id } = useParams()

  const fetchData = () => {
    axios.get('/api/v1/tasks/' + id)
      .then(resp => { setTask(resp.data.data) })
      .catch(data => { setIsInvalidId(true) })
  }

  const openModal = () => { setShowModal(true) }
  const closeModal = () => { setShowModal(false) }

  useEffect(fetchData, [])
  useEffect(fetchData, [showModal])

  if (isInvalidId) return <Navigate to="/" />

  if (task === null) return <h1>Loading ...</h1>

  const editTask = () => {
    axios.patch('/api/v1/tasks/' + id,
      {
        description: document.getElementById("input_description").value || task.attributes.description,
        is_done: document.getElementById("input_is_done").checked,
        due_date: document.getElementById("input_due_date").value || task.attributes.due_date
      })
      .then(closeModal)
  }

  const deleteTask = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete('/api/v1/tasks/' + id)
        .then(() => setIsInvalidId(true))
    }
  }

  const checkbox = task.attributes.is_done
    ? <input type="checkbox" id="input_is_done" defaultChecked />
    : <input type="checkbox" id="input_is_done" />

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

      <button onClick={openModal}>Edit</button>
      <b> | </b>
      <button onClick={deleteTask}>Delete</button>
      <b> | </b>
      <Link to={"/"}>Back</Link>

      <Modal isOpen={showModal} onRequestClose={closeModal} ariaHideApp={false}>
        <h2>Edit Details of Task ID {id}</h2>
        <p>
          <label>Description: </label>
          <input id="input_description" defaultValue={task.attributes.description} />
          <br />

          <label>Is done: </label>
          {checkbox}
          <br />

          <label>Due date: </label>
          <input id="input_due_date" defaultValue={task.attributes.due_date} />
        </p>
        <p>
          <button onClick={editTask}>Update</button>
          <b> | </b>
          <button onClick={closeModal}>Close</button>
        </p>
      </Modal>
    </div>
  )
}

export default Task
