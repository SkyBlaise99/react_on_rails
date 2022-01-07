# README

Guide used: [link](https://zayne.io/articles/how-to-build-a-crud-app-with-ruby-on-rails-and-react#GettingStarted)

## Running the app

Open terminal to run `run.sh`

## Creating new Rails App with React + PostgreSQL

`rails new react_on_rails --webpack=react --database=postgresql`

## Creating database

`cd react_on_rails`

`rails db:create`

## Making data model

``` java
public class Task {
    String description;
    boolean is_done;
    DateTime due_date;
}
```

`rails g model Task description:string is_done:boolean due_date:datetime`

`rails db:migrate`

Use `rails c` to open console:
* Add dummy data
    * `task = Task.new( description: "CVWO Assignment", is_done: false, due_date: "2022-01-25 23:59" )`
    * `task.save`
    * `task = Task.new( description: "Dummy Assignment", is_done: true, due_date: "23:59" )`
    * `task.save`
* If encounter `uninitialized constant Task (NameError)`, input `reload!`
* To exit: `quit`

## Building JSON API

Add `gem 'fast_jsonapi'` to `Gemfile`

`bundle install`

`rails g serializer Task description is_done due_date`

`task = Task.first`

`TaskSerializer.new(task).serialized_json`

`TaskSerializer.new(task).as_json`

## Making controller

`rails g controller pages index`

## Installing react-router-dom

`yarn add react-router-dom`

## Installing axios

`yarn add axios`

## Installing react modal

[link](https://github.com/reactjs/react-modal)

`yarn add react-modal`

## Installing MUI

[link](https://mui.com/)

`yarn add @mui/material @emotion/react @emotion/styled`

`yarn add @mui/icons-material`

`yarn add date-fns @date-io/date-fns`

`yarn add @mui/lab`
 
 ## Adding new columns

`rails g migration AddNoteAndIsPinnedToTasks note:string is_pinned:boolean`

`rails db:migrate`
