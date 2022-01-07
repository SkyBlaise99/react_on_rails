import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'

import {
  Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, IconButton,
  List, ListItem, ListItemText, Modal, Stack, Switch, TextField
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { format, parseISO } from 'date-fns'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import DateTimePicker from '@mui/lab/DateTimePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

const style_home = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
};

const style_loading = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const style_modal = {
  position: 'absolute',
  top: '35%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  px: 4,
  pb: 1,
};

function formatDateTime(dateTime) {
  return format(parseISO(dateTime), 'MMM dd, yyyy hh:mm a');
}

const Task = () => {
  const { id } = useParams()

  const [task, setTask] = useState(null)
  const [isInvalidId, setIsInvalidId] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [description, setDescription] = useState(null)
  const [checked, setChecked] = useState(null)
  const [dueDate, setDueDate] = useState(null)
  const [note, setNote] = useState(null)

  const [descErrMsg, setDescErrMsg] = useState("")
  const [dateErrMsg, setDateErrMsg] = useState("")

  const fetchData = () => {
    axios.get('/api/v1/tasks/' + id)
      .then(resp => { setTask(resp.data.data.attributes) })
      .catch(data => { setIsInvalidId(true) })
  }

  const openModal = () => {
    setDescription(task.description)
    setChecked(task.is_done)
    setDueDate(task.due_date)
    setNote(task.note)

    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    clearErrMsg()
  }

  useEffect(fetchData, [])

  useEffect(fetchData, [showModal])

  if (isInvalidId) return <Navigate to="/" />

  if (task === null) return (
    <Box sx={style_loading}>
      <h1>Loading ...</h1>
      <h5>You can try refereshing the page :)</h5>
    </Box>
  )

  const editTask = () => {
    clearErrMsg()
    axios.patch('/api/v1/tasks/' + id,
      {
        description: description,
        is_done: checked,
        due_date: dueDate,
        note: note
      })
      .then(closeModal)
      .catch((error) => {
        const details = error.response.data.error
        if (details.description) setDescErrMsg(details.description)
        if (details.due_date) {
          if (dueDate) setDateErrMsg("invalid format")
          else setDateErrMsg(details.due_date)
        }
      })
  }

  const deleteTask = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios.delete('/api/v1/tasks/' + id)
        .then(() => setIsInvalidId(true))
    }
  }

  const clearErrMsg = () => {
    setDescErrMsg("")
    setDateErrMsg("")
  }

  const handleSetDesc = (event) => { setDescription(event.target.value) }

  const handleSetChecked = (event) => { setChecked(event.target.checked) }

  const handleSetDueDate = (newValue) => { setDueDate(newValue) }

  const handleSetNote = (event) => { setNote(event.target.value) }

  return (
    <Box sx={style_home}>
      <Stack spacing={2}>
        <List>
          <ListItem
            key={id}
            disablePadding
            secondaryAction={
              <>
                < IconButton onClick={openModal}>
                  <EditIcon />
                </IconButton >
                < IconButton onClick={deleteTask}>
                  <DeleteIcon />
                </IconButton >
                <Button variant="outlined" href="/">Back</Button>
              </>
            }
          >
            <ListItemText
              primary="Details of Task"
              primaryTypographyProps={{ fontSize: '24px' }}
              secondary={"ID: " + id}
            />
          </ListItem>
        </List>

        <TextField label="Description" value={task.description} InputProps={{ readOnly: true }} />

        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={task.is_done} />}
            label="Is done"
            labelPlacement="start"
            sx={{ justifyContent: "left" }}
          />
        </FormGroup>

        <Grid container direction={"row"} columnSpacing={5}>
          <Grid item>
            <TextField InputProps={{ readOnly: true }} label="Due date" value={formatDateTime(task.due_date)} />
          </Grid>
          <Grid item>
            <TextField InputProps={{ readOnly: true }} label="Created on" value={formatDateTime(task.created_at)} />
          </Grid>
          <Grid item>
            <TextField InputProps={{ readOnly: true }} label="Last edited on" value={formatDateTime(task.updated_at)} />
          </Grid>
        </Grid>

        <TextField label="Note" value={task.note} InputProps={{ readOnly: true }} multiline maxRows={5} />
      </Stack>

      <Modal open={showModal} onClose={closeModal} >
        <Box sx={style_modal}>
          <h2>{"Edit Details of Task ID " + id}</h2>
          <Stack spacing={2}>
            {descErrMsg == ""
              ? <TextField label="Description of the task" value={description} onChange={handleSetDesc} />
              : <TextField label="Description of the task" value={description} onChange={handleSetDesc} error helperText={descErrMsg} />}
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
            <TextField label="Note for the task" value={note} onChange={handleSetNote} multiline maxRows={3} />
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 1, m: 1, bgcolor: 'background.paper' }}>
              <Button onClick={editTask} variant="contained">Update</Button>
              <Button onClick={closeModal} variant="outlined">Close</Button>
            </Box>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}

export default Task
