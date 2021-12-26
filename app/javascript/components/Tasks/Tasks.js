import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import axios from 'axios'
import {
  Checkbox,
  IconButton,
  List, ListItem, ListItemButton, ListItemText,
  TextField,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function filterTaskList(taskList, query) {
  return query
    ? taskList.filter((task) => task.attributes.description.toLowerCase().includes(query))
    : taskList;
}

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [referesh, setReferesh] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [task, setTask] = useState(null)

  const fetchData = () => {
    axios.get('/api/v1/tasks/')
      .then(resp => { setTasks(resp.data.data) })
      .catch(data => { debugger })
  }

  useEffect(fetchData, [])

  useEffect(() => {
    fetchData()
    setReferesh(false)
  }, [referesh, showModal])

  const openAddModal = () => {
    setTask(null)
    setShowModal(true)
  }

  const openEditModal = (task) => {
    setTask(task)
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false) }

  const addTask = () => {
    axios.post('/api/v1/tasks/',
      {
        description: document.getElementById("input_description").value || "Test task",
        is_done: false,
        due_date: document.getElementById("input_due_date").value || "23:59"
      })
      .then(closeModal)
  }

  const editTask = () => {
    axios.patch('/api/v1/tasks/' + task.id,
      {
        description: document.getElementById("input_description").value || task.attributes.description,
        is_done: document.getElementById("input_is_done").checked,
        due_date: document.getElementById("input_due_date").value || task.attributes.due_date
      })
      .then(closeModal)
  }

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete('/api/v1/tasks/' + id)
        .then(() => setReferesh(true))
    }
  }

  const handleSearchChange = () => { setSearchQuery(document.getElementById("tf_search").value) }

  const toggleIsDoneStatus = (task) => {
    axios.patch('/api/v1/tasks/' + task.id, { is_done: !task.attributes.is_done })
      .then(() => setReferesh(true))
  }

  const formattedTaskList = filterTaskList(tasks, searchQuery).map((task, index) => (
    <ListItem
      key={index}
      secondaryAction={
        <>
          <Checkbox checked={task.attributes.is_done} onClick={() => toggleIsDoneStatus(task)} />
          < IconButton onClick={() => openEditModal(task)}>
            <EditIcon />
          </IconButton >
          < IconButton onClick={() => deleteTask(task.id)}>
            <DeleteIcon />
          </IconButton >
        </>
      }
      disablePadding
    >
      <ListItemButton component={Link} to={"/" + task.id}>
        <ListItemText
          primary={task.attributes.description}
          secondary={"By: " + task.attributes.due_date}
        />
      </ListItemButton>
    </ListItem >
  ));

  const showTaskTemplate = task === null
    ?
    <>
      <h2>Input Details of New Task</h2>
      <p>
        <label>Description: </label>
        <input id="input_description" />
        <br />

        <label>Due date: </label>
        <input id="input_due_date" />
      </p>
      <p>
        <button onClick={addTask}>Submit</button>
        <b> | </b>
        <button onClick={closeModal}>Close</button>
      </p>
    </>
    :
    <>
      <h2>Edit Details of Task ID {task.id}</h2>
      <p>
        <label>Description: </label>
        <input id="input_description" defaultValue={task.attributes.description} />
        <br />

        <label>Is done: </label>
        {task.attributes.is_done
          ? <input type="checkbox" id="input_is_done" defaultChecked />
          : <input type="checkbox" id="input_is_done" />}
        <br />

        <label>Due date: </label>
        <input id="input_due_date" defaultValue={task.attributes.due_date} />
      </p>
      <p>
        <button onClick={editTask}>Update</button>
        <b> | </b>
        <button onClick={closeModal}>Close</button>
      </p>
    </>

  return (
    <div className="home">
      <div className="header">
        <h1>Sora</h1>
        <p>Your number 1 task manager</p>
      </div>

      <div className="add_task">
        <button onClick={openAddModal}>Add a new Task</button>
      </div>
      <br />

      <div className="search">
        <TextField
          id="tf_search"
          label="Search for your task :)"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Your list of tasks
      </Typography>
      <List>
        {formattedTaskList}
      </List>

      <Modal isOpen={showModal} onRequestClose={closeModal} ariaHideApp={false}>
        {showTaskTemplate}
      </Modal>
    </div>
  )
}

export default Tasks
