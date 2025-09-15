import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskItem from "../../Item/TaskItem";
import TaskModal from "../../Item/TaskModal";

const OverdueTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/tasks/overdue"
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleOpenModal = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
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

  const handleCreateTask = async (newTask) => {
    try {
      await axios.post("http://localhost:8081/api/tasks", newTask);
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div style={styles.gridContainer}>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onClick={handleOpenModal} />
      ))}
      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          task={selectedTask}
          onClose={handleCloseModal}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      )}
      <button onClick={() => setSelectedTask(null)} style={styles.lastbutton}>
        + Add Task
      </button>
    </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    padding: "20px",
  },
  lastbutton: {
    padding: "10px 20px",
    backgroundColor: "#1b4593",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
};

export default OverdueTasks;
