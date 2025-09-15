import React, { useState } from "react";
import "./styles.css";
import axios from "axios";

const Home = () => {
  const [tasks, setTasks] = useState([
    { title: "", description: "", category: "", dueDate: "", dueTime: "" },
  ]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const addTaskField = () => {
    setTasks([
      ...tasks,
      { title: "", description: "", category: "", dueDate: "", dueTime: "" },
    ]);
  };

  const removeTaskField = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSortedTasks([]);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/analyze-tasks",
        { tasks },
        { withCredentials: true } // Ensure session cookie is sent
      );

      if (response.data.success) {
        setSortedTasks(response.data.tasks);
      } else {
        // Handle case where backend returns success: false
        try {
          const parsedRaw = JSON.parse(response.data.raw);
          if (Array.isArray(parsedRaw)) {
            setSortedTasks(parsedRaw);
          } else {
            setError("Dữ liệu thô từ server không phải mảng JSON hợp lệ.");
            console.error("Raw data:", response.data.raw);
          }
        } catch (parseError) {
          setError(
            response.data.error || "Dữ liệu thô từ server không hợp lệ."
          );
          console.error(
            "Parse error:",
            parseError,
            "Raw data:",
            response.data.raw
          );
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi khi gửi yêu cầu đến server.");
      console.error("Request error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>📋 Phân tích & Sắp xếp Công Việc</h1>
      <form onSubmit={handleSubmit} className="task-form">
        {tasks.map((task, index) => (
          <div key={index} className="task-input-group">
            <input
              type="text"
              placeholder="📝 Tiêu đề"
              value={task.title}
              onChange={(e) =>
                handleInputChange(index, "title", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="📌 Mô tả"
              value={task.description}
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
            />
            <select
              value={task.category}
              onChange={(e) =>
                handleInputChange(index, "category", e.target.value)
              }
              required
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="Work">Work</option>
              <option value="School">School</option>
              <option value="Personal">Personal</option>
            </select>
            <input
              type="date"
              value={task.dueDate}
              onChange={(e) =>
                handleInputChange(index, "dueDate", e.target.value)
              }
              required
            />
            <input
              type="time"
              value={task.dueTime}
              onChange={(e) =>
                handleInputChange(index, "dueTime", e.target.value)
              }
              required
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeTaskField(index)}
              disabled={tasks.length === 1}
            >
              ❌
            </button>
          </div>
        ))}

        <div className="button-group">
          <button type="button" onClick={addTaskField} className="btn add-btn">
            ➕ Thêm Task
          </button>
          <button type="submit" disabled={loading} className="btn analyze-btn">
            📊 Phân tích và Sắp xếp
          </button>
        </div>
      </form>

      {loading && <p>⏳ Đang xử lý...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {sortedTasks.length > 0 && (
        <div className="sorted-tasks">
          <h2>
            ✅ Bạn nên sắp xếp thứ tự danh sách các công việc như sau để đạt
            hiệu quả học tập cao nhất nhé !
          </h2>
          <ul>
            {sortedTasks.map((task, index) => (
              <li key={index} className="sorted-task-item">
                <strong>{task.title}</strong> — <em>{task.category}</em> <br />
                🗓️ {new Date(task.dueDate).toLocaleDateString()}{" "}
                {task.dueTime && `lúc ${task.dueTime}`} <br />
                📌 {task.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
