import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import axios from 'axios'

import {
  Box, Button, Checkbox, Fab, IconButton, List, ListItem, ListItemButton,
  ListItemText, Modal, Stack, Switch, TextField, Typography
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { format, parseISO } from 'date-fns'
import { AdapterDateFns, DateTimePicker, LocalizationProvider } from '@mui/lab'

function filterTaskList(taskList, query) {
  return query
    ? taskList.filter((task) => task.attributes.description.toLowerCase().includes(query))
    : taskList;
}

const style = {
  position: 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [referesh, setReferesh] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [task, setTask] = useState(null)
  const [checked, setChecked] = useState(null)
  const [dueDate, setDueDate] = useState(new Date())

  const [descErrMsg, setDescErrMsg] = useState("")
  const [dateErrMsg, setDateErrMsg] = useState("")

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
    setDueDate(new Date())
    setShowModal(true)
  }

  const openEditModal = (task) => {
    setTask(task)
    setChecked(task.attributes.is_done)
    setDueDate(task.attributes.due_date)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    clearErrMsg()
  }

  const addTask = () => {
    clearErrMsg()
    axios.post('/api/v1/tasks/',
      {
        description: document.getElementById("input_description").value,
        is_done: false,
        due_date: dueDate
      })
      .then(closeModal)
      .catch(setErrMsg)
  }

  const editTask = () => {
    clearErrMsg()
    axios.patch('/api/v1/tasks/' + task.id,
      {
        description: document.getElementById("input_description").value,
        is_done: checked,
        due_date: dueDate
      })
      .then(closeModal)
      .catch(setErrMsg)
  }

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete('/api/v1/tasks/' + id)
        .then(() => setReferesh(true))
    }
  }

  const setErrMsg = (error) => {
    const details = error.response.data.error
    if (details.description) setDescErrMsg(details.description)
    if (details.due_date) setDateErrMsg(details.due_date)
  }

  const clearErrMsg = () => {
    setDescErrMsg("")
    setDateErrMsg("")
  }

  const handleSearchChange = () => { setSearchQuery(document.getElementById("tf_search").value) }

  const toggleIsDoneStatus = (task) => {
    axios.patch('/api/v1/tasks/' + task.id, { is_done: !task.attributes.is_done })
      .then(() => setReferesh(true))
  }

  const handleSetChecked = (event) => { setChecked(event.target.checked) }

  const handleSetDueDate = (newValue) => { setDueDate(newValue) }

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
          secondary={"By: " + format(parseISO(task.attributes.due_date), 'MMM dd, yyyy hh:mm a')}
        />
      </ListItemButton>
    </ListItem >
  ));

  const showTaskTemplate = task === null ?
    <Box sx={style}>
      <h2>Input Details of New Task</h2>
      <Stack spacing={2}>
        {descErrMsg == ""
          ? <TextField id="input_description" label="Description of the task" />
          : <TextField id="input_description" label="Description of the task" error helperText={descErrMsg} />}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Due Date"
            value={dueDate}
            onChange={handleSetDueDate}
            renderInput={(params) =>
              dateErrMsg == ""
                ? <TextField {...params} />
                : <TextField {...params} error helperText={dateErrMsg} />
            }
          />
        </LocalizationProvider>
        <Box>
          <Button onClick={addTask}>Submit</Button>
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Stack>
    </Box>
    :
    <Box sx={style}>
      <h2>Edit Details of Task ID {task.id}</h2>
      <Stack spacing={2}>
        {descErrMsg == ""
          ? <TextField id="input_description" label="Description of the task" defaultValue={task.attributes.description} />
          : <TextField id="input_description" label="Description of the task" error helperText={descErrMsg} />}
        <Box>
          <label>Is done: </label>
          <Switch
            checked={checked}
            onChange={handleSetChecked}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Due Date"
            value={dueDate}
            onChange={handleSetDueDate}
            renderInput={(params) =>
              dateErrMsg == ""
                ? <TextField {...params} />
                : <TextField {...params} error helperText={dateErrMsg} />
            }
          />
        </LocalizationProvider>
        <Box>
          <Button onClick={editTask}>Update</Button>
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Stack>
    </Box >

  return (
    <div className="home">
      <div className="header">
        <h1>Sora</h1>
        <p>Your number 1 task manager</p>
      </div>

      <div>
        <TextField
          id="tf_search"
          label="Search for your task :)"
          variant="standard"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Fab color="primary" onClick={openAddModal}>
          <AddIcon />
        </Fab>
      </div>

      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Your list of tasks
      </Typography>
      <List>
        {formattedTaskList}
      </List>

      <Modal open={showModal} onClose={closeModal} >
        {showTaskTemplate}
      </Modal>
    </div>
  )
}

export default Tasks
