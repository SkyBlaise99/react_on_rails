import React, { useState, useEffect } from 'react'
import axios from 'axios'

function filterTaskList(taskList, query) {
  if (!query) {
    return taskList;
  }

  return taskList.filter((task) =>
    task.attributes.description
      .toLowerCase()
      .includes(query)
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredTaskList = filterTaskList(tasks, searchQuery)
    .map((task, index) =>
      (<li key={index} >{task.attributes.description}</li>)
    );

  return (
    <div className="home">
      <div className="header">
        <h1>Task Manager</h1>
      </div>

      <div className="search">
        <input
          type="text"
          id="search"
          placeholder="Type something to search for your task :)"
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="list">
        <p>List of Tasks goes here ...</p>
        <ul>{filteredTaskList}</ul>
      </div>
    </div>
  )
}

export default Tasks
