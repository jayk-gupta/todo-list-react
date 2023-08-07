import { useState } from "react";
import html2canvas from "html2canvas";
import { Trash, Check } from "@phosphor-icons/react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  // Add tasks
  function handleAddTask(task) {
    setTasks((prevTasks) => {
      if (
        prevTasks.find((OldTask) => OldTask.description === task.description)
      ) {
        alert("You have already added this task");
        return prevTasks;
      }
      return [task, ...prevTasks];
    });
  }
  // Delete tasks
  function handledeleteTask(id) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  }
  // clear list
  function handleClearTasks() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all tasks?"
    );
    if (confirmed) setTasks([]);
  }
  //toggle task
  function handleToggleTask(id) {
    setTasks((task) =>
      tasks.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  }
  return (
    <div className="container">
      <Logo />
      <Form onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onDeleteItem={handledeleteTask}
        onToggleTask={handleToggleTask}
        onClearTasks={handleClearTasks}
      />
      <Stats tasks={tasks} />
    </div>
  );
}

function Logo() {
  return <h1>Todo List 📝</h1>;
}

function Form({ onAddTask }) {
  const [title, setTitle] = useState("college");
  const [description, setDescription] = useState("");

  // submit handler
  function handleSubmit(e) {
    e.preventDefault();
    if (!description && !title) return;

    const newTask = { id: Date.now(), title, description };
    // add new task to existing list
    onAddTask(newTask);
    setDescription("");
  }
  // handle input
  function handleInput(e) {
    setDescription(e.target.value);
  }
  return (
    <div>
      <form className="dd-form" onSubmit={handleSubmit}>
        <h3>What tasks do you need to do today?</h3>
        <div className="form-input">
          <select value={title} onChange={(e) => setTitle(e.target.value)}>
            <option value={"college"}>College</option>
            <option value={"DSA"}>DSA</option>
            <option value={"development"}>Development</option>
            <option value={"other"}>Other</option>
          </select>
          <input
            type="text"
            placeholder="Enter Task..."
            value={description}
            onChange={handleInput}
          />
          <button className="btn">Add</button>
        </div>
      </form>
    </div>
  );
}

function TaskList({ tasks, onDeleteItem, onToggleTask, onClearTasks }) {
  console.log(tasks);
  function clearTasks() {
    onClearTasks();
  }
  return (
    <>
      <div className="task-list">
        <ul className="list">
          {tasks.map((task) => (
            <Task
              task={task}
              key={task.id}
              onDeleteItem={onDeleteItem}
              onToggleTask={onToggleTask}
            />
          ))}
        </ul>
      </div>
      <div className="btn-actions">
        <button className="btn btn-action" onClick={clearTasks}>
          Clear Tasks
        </button>
        <button
          className="btn btn-action"
          onClick={() => {
            if (tasks.length) {
              capture();
            }
          }}
        >
          Download
        </button>
      </div>
    </>
  );
}
function Task({ task, onDeleteItem, onToggleTask }) {
  function deleteTask() {
    onDeleteItem(task.id);
  }
  return (
    <div className="task-box">
      <li style={task.status ? { opacity: 0.5 } : {}}>
        <span
          className="task-desc"
          style={task.status ? { textDecoration: "line-through" } : {}}
        >
          <span className="task-title">{task.title}</span> {task.description}
        </span>
        <div className="task-operation">
          <button
            className=" btn-action btn-cmplt "
            onClick={() => onToggleTask(task.id)}
          >
            <Check className="icon" />
          </button>

          <button className="btn-action btn-del" onClick={deleteTask}>
            <Trash className="icon" />
          </button>
        </div>
      </li>
    </div>
  );
}
function Stats({ tasks }) {
  if (!tasks.length)
    return (
      <footer>
        <em>Start adding tasks on your todo list!</em>
      </footer>
    );
  const numTasks = tasks.length;
  const numCompleted = tasks.filter((task) => task.status).length;
  const percentage = Math.round((numCompleted / numTasks) * 100);
  return (
    <footer>
      <em>
        {percentage === 100 ? (
          <p>Yay!🎉 You have completed all your tasks</p>
        ) : (
          <p>
            You have {numTasks} tasks on your list, and you have already done{" "}
            {numCompleted} ({percentage}%)
          </p>
        )}
      </em>
    </footer>
  );
}

function capture() {
  const tasklist = document.querySelector(".task-list");

  html2canvas(tasklist, { backgroundColor: "#000" }).then((canvas) => {
    const imgDtaa = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "todolist.png";
    link.href = imgDtaa;
    link.click();
  });
}
