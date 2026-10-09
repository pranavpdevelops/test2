import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/tasks";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadTasks() {
    const res = await fetch(API, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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

  async function deleteTask(id) {
    if (!window.confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      <h2>Admin Dashboard</h2>
      <p>All users' tasks</p>
      <p className="error">{error}</p>

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <div>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            <small>
              Owner: {task.user_id?.name || "Unknown"} (
              {task.user_id?.email || "Unknown"})
            </small>
          </div>

          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}