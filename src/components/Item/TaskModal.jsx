import React, { useState, useEffect } from "react";
import "./TaskModal.css";
import Timer from "../Timer/index";

const TaskModal = ({
  isOpen,
  onClose,
  onCreateTask,
  task: initialTask = null,
  onDelete,
  onSave,
}) => {
  const [editedTask, setEditedTask] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    category: initialTask?.category || "Academic",
    priority: initialTask?.priority || "Medium",
    dueDate: initialTask?.dueDate || "",
    estimatedDuration: initialTask?.estimatedDuration || 60,
    status: initialTask?.status || "Chưa thực hiện",
    id: initialTask?.id || Date.now(),
  });

  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setEditedTask({
        ...initialTask,
        dueDate: initialTask.dueDate || "",
        estimatedDuration: initialTask.estimatedDuration || 60,
        status: initialTask.status || "Chưa thực hiện",
      });
    } else {
      setEditedTask({
        title: "",
        description: "",
        category: "Academic",
        priority: "Medium",
        dueDate: "",
        estimatedDuration: 60,
        status: "Chưa thực hiện",
        id: Date.now(),
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialTask) {
      onSave(editedTask);
    } else {
      onCreateTask(editedTask);
    }
  };

  const handleDoNow = () => {
    setShowTimer(true);
  };

  const handleCloseTimer = () => {
    setShowTimer(false);
  };

  const handleTimerComplete = () => {
    setEditedTask((prev) => ({ ...prev, status: "Đã hoàn thành" }));
    handleCloseTimer();
    if (initialTask) onSave(editedTask);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialTask ? "Edit Task" : "Create New Task"}</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={editedTask.category}
                onChange={handleChange}
                required
              >
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <select
                name="priority"
                value={editedTask.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={editedTask.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Estimated Duration (minutes)</label>
              <input
                type="number"
                name="estimatedDuration"
                value={editedTask.estimatedDuration}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={editedTask.status}
              onChange={handleChange}
              required
            >
              <option value="Chưa thực hiện">Chưa thực hiện</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="create-btn">
              {initialTask ? "Save" : "Create Task"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleDoNow}>
              Do Now
            </button>
            {initialTask && onDelete && (
              <button
                type="button"
                className="delete-btn"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => onDelete(editedTask._id)}
              >
                Delete
              </button>
            )}
          </div>
        </form>

        {showTimer && (
          <div className="timer-modal-overlay">
            <div className="timer-modal-content">
              <button className="close-btn" onClick={handleCloseTimer}>
                ×
              </button>
              <Timer
                initialDuration={editedTask.estimatedDuration * 60}
                onComplete={handleTimerComplete}
                onClose={handleCloseTimer}
                taskId={initialTask?.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
