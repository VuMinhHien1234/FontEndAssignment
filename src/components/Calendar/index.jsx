import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./styles.css";
import axios from "axios";
import TaskModal from "../Item/TaskModal";
import TaskItem from "../Item/TaskItem";
const CalendarScreen = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: "",
    priority: "Medium",
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleOpenModal = (task) => {
    setSelectedTask(task);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/tasks/totaltasks"
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8081/api/tasks/${taskId}`);
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      await axios.put(
        `http://localhost:8081/api/tasks/${updatedTask._id}`,
        updatedTask
      );
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  useEffect(() => {
    filterTasksForDate(date);
  }, [date, allTasks]);

  const fetchAllTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8081/api/tasks");
      setAllTasks(response.data);
    } catch (err) {
      setError(
        "Lỗi khi tải task: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const filterTasksForDate = (selectedDate) => {
    const filteredTasks = allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const compareDate = new Date(selectedDate);

      return (
        taskDate.getDate() === compareDate.getDate() &&
        taskDate.getMonth() === compareDate.getMonth() &&
        taskDate.getFullYear() === compareDate.getFullYear()
      );
    });
    setTasks(filteredTasks);
  };

  const handleDateClick = (value) => {
    setDate(value);
  };

  const handleAddTask = () => {
    setNewTask({
      title: "",
      description: "",
      category: "",
      dueDate: date.toISOString().split("T")[0],
      priority: "Medium",
    });
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
    setNewTask({
      title: "",
      description: "",
      category: "",
      dueDate: "",
      priority: "Medium",
    });
    setSelectedTask(null);
  };

  const getTaskCountForDate = (calendarDate) => {
    return allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === calendarDate.getDate() &&
        taskDate.getMonth() === calendarDate.getMonth() &&
        taskDate.getFullYear() === calendarDate.getFullYear()
      );
    }).length;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  return (
    <div className="calendar-container">
      <h1>Lịch Công Việc</h1>
      <div className="calendar-wrapper">
        <div className="calendar-header">
          <button onClick={goToPreviousMonth} disabled={loading}>
            Tháng trước
          </button>
          <span className="calendar-year">
            Tháng {date.getMonth() + 1} năm {date.getFullYear()}
          </span>
          <button onClick={goToNextMonth} disabled={loading}>
            Tháng sau
          </button>
        </div>
        <Calendar
          onClickDay={handleDateClick}
          value={date}
          tileContent={({ date: tileDate, view }) => {
            if (view === "month") {
              const taskCount = getTaskCountForDate(tileDate);
              return taskCount > 0 ? (
                <div className="task-dot">{taskCount}</div>
              ) : null;
            }
            return null;
          }}
          showNeighboringMonth={true}
          minDetail="month"
          maxDetail="month"
        />
        <button
          onClick={handleAddTask}
          disabled={loading}
          className="add-task-btn"
        >
          Thêm Task Mới cho ngày {date.toLocaleDateString("vi-VN")}
        </button>
      </div>

      {loading && <p className="loading">Đang tải...</p>}
      {error && <p className="error">{error}</p>}

      {tasks.length > 0 && (
        <div className="tasks-list">
          <h2>Công việc ngày {date.toLocaleDateString("vi-VN")}</h2>
          <ul>
            {tasks.map((task) => (
              <TaskItem key={task._id} task={task} onClick={handleOpenModal} />
            ))}
          </ul>
        </div>
      )}

      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CalendarScreen;
