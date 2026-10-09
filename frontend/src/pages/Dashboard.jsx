import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/tasks";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  async function loadTasks() {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!res.ok) throw new Error(data.message || "Failed to load tasks");

    setTasks(data);
  }

  useEffect(() => {
    loadTasks().catch((err) => setError(err.message));
  }, []);

  async function saveTask(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Could not save task");

      setTitle("");
      setDescription("");
      setEditId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="dashboard">
      <button onClick={logout}>Logout</button>
      <h2>User Dashboard</h2>
      <p>Welcome, {user?.name}</p>

      <form onSubmit={saveTask}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button>{editId ? "Update Task" : "Add Task"}</button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setDescription("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <p className="error">{error}</p>

      <h3>My Tasks ({tasks.length})</h3>

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <div>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
          </div>

          <button
            onClick={() => {
              setEditId(task._id);
              setTitle(task.title);
              setDescription(task.description || "");
            }}
          >
            Edit
          </button>

          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}