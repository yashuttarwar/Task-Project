import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css"; // make sure App.css exists

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/tasks", { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Could not fetch tasks:", err.message);
    }
  };

  const saveTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await axios.put(`/api/tasks/${editId}`, { title, status }, { headers: { Authorization: `Bearer ${token}` } });
        setEditId(null);
      } else {
        await axios.post("/api/tasks", { title, status }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setTitle("");
      setStatus("Pending");
      fetchTasks();
    } catch (err) {
      console.error("❌ Error saving task:", err.message);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (err) {
      console.error("❌ Error deleting task:", err.message);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setStatus(task.status);
    setEditId(task._id);
  };

  const updateStatus = async (task, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/tasks/${task._id}`, { ...task, status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchTasks();
    } catch (err) {
      console.error("❌ Error updating status:", err.message);
    }
  };

  const getStatusColor = (status) => {
    switch(status){
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In-progress": return "bg-blue-100 text-blue-800";
      case "Done": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="task-container">
      <h1 className="task-title">📝 Task Manager</h1>

      <form onSubmit={saveTask} className="task-form">
        <input 
          type="text" 
          placeholder="Enter task title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="task-input"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="task-select">
          <option value="Pending">Pending</option>
          <option value="In-progress">In-progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit" className="btn">{editId ? "✏️ Update Task" : "➕ Add Task"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setTitle(""); setStatus("Pending"); }} className="btn-cancel">❌ Cancel</button>}
      </form>

      <ul className="task-list">
        {tasks.length > 0 ? tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div className="task-info">
              <span className="task-title-text">{task.title}</span>
              <span className={`task-badge ${getStatusColor(task.status)}`}>{task.status}</span>
            </div>
            <div className="task-actions">
              <button onClick={() => editTask(task)} className="btn-action" title="Edit Task">✏️</button>
              <button onClick={() => updateStatus(task, "Pending")} className="btn-action" title="Mark Pending">🕓</button>
              <button onClick={() => updateStatus(task, "In-progress")} className="btn-action" title="Mark In-progress">⚡</button>
              <button onClick={() => updateStatus(task, "Done")} className="btn-action" title="Mark Done">✅</button>
              <button onClick={() => deleteTask(task._id)} className="btn-delete" title="Delete Task">🗑️</button>
            </div>
          </li>
        )) : <p className="task-empty">No tasks yet.</p>}
      </ul>
    </div>
  );
}

export default TaskPage;


