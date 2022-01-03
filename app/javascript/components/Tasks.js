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
import GitHubIcon from '@mui/icons-material/GitHub'

import { format, parseISO } from 'date-fns'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const style_home = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  m: 4,
};

const style_modal = {
  position: 'absolute',
  top: '27%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  const [description, setDescription] = useState(null)
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
    setDescription("")
    setDueDate(new Date())
    setShowModal(true)
  }

  const openEditModal = (task) => {
    setTask(task)
    setDescription(task.attributes.description)
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
        description: description,
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
        description: description,
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
    if (details.due_date) {
      if (dueDate) setDateErrMsg("invalid format")
      else setDateErrMsg(details.due_date)
    }
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

  const handleSetDesc = (event) => { setDescription(event.target.value) }

  const handleSetChecked = (event) => { setChecked(event.target.checked) }

  const handleSetDueDate = (newValue) => { setDueDate(newValue) }

  const formattedTaskList = filterTaskList(tasks, searchQuery).map((task, index) => (
    <ListItem
      key={index}
      disablePadding
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
    >
      <ListItemButton component={Link} to={"/" + task.id}>
        <ListItemText
          primary={task.attributes.description}
          secondary={"By: " + format(parseISO(task.attributes.due_date), 'MMM dd, yyyy hh:mm a')}
        />
      </ListItemButton>
    </ListItem >
  ));

  const showTaskTemplate =
    <Box sx={style_modal}>
      <h2>
        {task === null
          ? "Input Details of New Task"
          : "Edit Details of Task ID " + task.id}
      </h2>
      <Stack spacing={2}>
        {descErrMsg == ""
          ? <TextField label="Description of the task" value={description} onChange={handleSetDesc} />
          : <TextField label="Description of the task" value={description} onChange={handleSetDesc} error helperText={descErrMsg} />}
        {task === null ? <></> : <Box>
          <label>Is done: </label>
          <Switch
            checked={checked}
            onChange={handleSetChecked}
          />
        </Box>}
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
          {task === null
            ? <Button onClick={addTask}>Submit</Button>
            : <Button onClick={editTask}>Update</Button>}
          <Button onClick={closeModal}>Close</Button>
        </Box>
      </Stack>
    </Box >

  return (
    <Box sx={style_home}>
      <Box>
        <List>
          <ListItem
            key={0}
            disablePadding
            secondaryAction={
              <IconButton href="https://github.com/SkyBlaise99/react_on_rails">
                <GitHubIcon />
              </IconButton >
            }
          >
            <ListItemText
              primary="Sora"
              primaryTypographyProps={{ fontSize: '48px' }}
              secondary={"Your number 1 task manager"}
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Typography />

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
      </Box>

      <Typography sx={{ mt: 4 }} variant="h6" component="div">
        Your list of tasks
      </Typography>
      <List>
        {formattedTaskList}
      </List>

      <Modal open={showModal} onClose={closeModal} >
        {showTaskTemplate}
      </Modal>
    </Box >
  )
}

export default Tasks
