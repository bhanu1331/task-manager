import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const API = "https://task-manager-backend-3671.onrender.com/tasks";

  // Fetch tasks
  const fetchTasks = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add or Update task
  const addTask = () => {
    if (!title.trim()) return;

    if (editId) {
      // UPDATE
      fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      })
        .then(() => {
          setEditId(null);
          setTitle("");
          fetchTasks();
        })
        .catch(err => console.error("Update error:", err));
    } else {
      // ADD
      fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      })
        .then(() => {
          setTitle("");
          fetchTasks();
        })
        .catch(err => console.error("Add error:", err));
    }
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`${API}/${id}`, {
      method: "DELETE"
    })
      .then(() => fetchTasks())
      .catch(err => console.error("Delete error:", err));
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        textAlign: "center",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ color: "#05b1f5" }}>Task Manager</h1>

      <div
        style={{
          backgroundColor: "#38444e",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{
            padding: "8px",
            width: "70%",
            marginRight: "10px",
            backgroundColor: "#2c2c2c",
            color: "white",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={addTask}
          style={{
            padding: "8px 12px",
            background: "#2dbbdf",
            border: "none",
            cursor: "pointer"
          }}
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#2dbbdf",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}
          >
            <span>{task.title}</span>

            <div>
              <button
                onClick={() => {
                  setTitle(task.title);
                  setEditId(task.id);
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  marginLeft: "5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;