import React, { useState, useEffect } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import axios from "axios";
import TaskItem from "../Item/TaskItem";
import TaskModal from "../Item/TaskModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });
  const [weeklyStats, setWeeklyStats] = useState({
    todaysTasks: 0,
    thisWeek: 0,
    upcoming: 0,
  });
  const [completionRate, setCompletionRate] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/tasks");
      const allTasks = response.data;

      console.log("All tasks:", allTasks);

      const completed = allTasks.filter(
        (task) => task.status === "Đã hoàn thành"
      ).length;
      const pending = allTasks.filter((task) =>
        ["Chưa thực hiện", "Đang thực hiện"].includes(task.status)
      ).length;
      const overdue = allTasks.filter(
        (task) => task.status === "Quá hạn"
      ).length;
      const totalTasks = allTasks.length;
      setStats({
        totalTasks,
        completed,
        pending,
        overdue,
      });

      const now = new Date("2025-09-14T23:24:00Z");
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        .toISOString()
        .split("T")[0];
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        .toISOString()
        .split("T")[0];
      now.setDate(now.getDate() + 6);
      const endOfWeek = new Date(now).toISOString().split("T")[0];

      const todaysTasks = allTasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate).toISOString().split("T")[0] === today
      ).length;
      const thisWeekTasks = allTasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate).toISOString().split("T")[0] >= startOfWeek &&
          new Date(task.dueDate).toISOString().split("T")[0] <= endOfWeek
      ).length;
      const filteredUpcomingTasks = allTasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        console.log(
          `Task: ${task.title}, dueDate: ${task.dueDate}, Converted: ${taskDate}, Now: ${now}`
        );
        return (
          !isNaN(taskDate.getTime()) &&
          taskDate > new Date("2025-09-14T23:24:00Z")
        );
      });
      const upcomingTasksCount = filteredUpcomingTasks.length;

      setTasks(allTasks);
      setWeeklyStats({
        todaysTasks,
        thisWeek: thisWeekTasks,
        upcoming: upcomingTasksCount,
      });
      setUpcomingTasks(filteredUpcomingTasks);
      const rate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
      setCompletionRate(Math.round(rate));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
      fetchDashboardData();
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
      fetchDashboardData();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const statItems = [
    {
      label: "Total Tasks",
      icon: "✅",
      value: stats.totalTasks,
      route: "/totaltask",
    },
    {
      label: "Completed",
      icon: "🎯",
      value: stats.completed,
      route: "/completedtask",
    },
    {
      label: "Pending",
      icon: "⏰",
      value: stats.pending,
      route: "/pendingtask",
    },
    {
      label: "Over due",
      icon: "‼️",
      value: stats.overdue,
      route: "/overduetask",
    },
  ];

  const weeklyStatsData = [
    { label: "Today's Tasks", value: weeklyStats.todaysTasks },
    { label: "This Week", value: weeklyStats.thisWeek },
    { label: "Upcoming", value: weeklyStats.upcoming },
  ];

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Overview of your academic progress and tasks</p>
      <div className="stats">
        {statItems.map((item, index) => (
          <Link key={index} to={item.route} style={styles.link}>
            <div style={styles.statbox}>
              <div style={styles.c2}>
                <span style={styles.icon}>{item.icon}</span>
                <span style={styles.label}>{item.label}</span>
              </div>
              <span style={styles.item_value}>{item.value}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="weekly-progress">
        <h2>Weekly Progress</h2>
        <div className="completion-info">
          <span className="completion-label">Overall Completion Rate</span>
          <span className="completion-percent" style={styles.completeRate}>
            {completionRate}%
          </span>
          <div className="progress-bar-background">
            <div
              className="progress-bar-fill"
              style={{
                width: `${completionRate}%`,
                backgroundColor: "#28a745",
              }}
            ></div>
          </div>
        </div>

        <div className="weekly-details">
          {weeklyStatsData.map((item, idx) => (
            <div key={idx} className="weekly-detail">
              <span className="detail-number">{item.value}</span>
              <span className="detail-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sections">
        <div className="section upcoming-section">
          <h3>Upcoming Tasks</h3>
          {upcomingTasks.length > 0 ? (
            <div className="upcoming-tasks-scroll">
              {upcomingTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onClick={handleOpenModal}
                />
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
            </div>
          ) : (
            <p>No upcoming tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
const styles = {
  statbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  c2: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  item_value: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  icon: { fontSize: "20px", color: "#28a745" },
  label: { fontSize: "16px", fontWeight: "normal" },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  completeRate: { color: "#28a745" },
};
