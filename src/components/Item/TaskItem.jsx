import React from "react";

const TaskItem = ({ task, onClick }) => {
  const {
    title,
    description,
    category,
    priority,
    dueDate,
    estimatedDuration,
    status,
  } = task;

  const getContainerStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { backgroundColor: "#f8d7da" };
      case "medium":
        return { backgroundColor: "#fff3cd" };
      case "low":
        return { backgroundColor: "#d1e7dd" };
      default:
        return { backgroundColor: "#fff" };
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "chưa thực hiện":
        return { backgroundColor: "#6c757d", color: "#fff" };
      case "đã hoàn thành":
        return { backgroundColor: "#198754", color: "#fff" };
      case "đang thực hiện":
        return { backgroundColor: "#fd7e14", color: "#fff" };
      case "quá hạn":
        return { backgroundColor: "#dc3545", color: "#fff" };
      default:
        return { backgroundColor: "#6c757d", color: "#fff" };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { backgroundColor: "#dc3545", color: "#fff" };
      case "medium":
        return { backgroundColor: "#fd7e14", color: "#fff" };
      case "low":
        return { backgroundColor: "#198754", color: "#fff" };
      default:
        return { backgroundColor: "#6c757d", color: "#fff" };
    }
  };

  return (
    <div
      style={{ ...styles.container, ...getContainerStyle(priority) }}
      onClick={() => onClick(task)}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <span style={{ ...styles.category, ...getPriorityStyle(priority) }}>
          {priority}
        </span>
        <span style={{ ...styles.status, ...getStatusStyle(status) }}>
          {status || "Chưa thực hiện"}
        </span>
      </div>

      <div style={styles.details}>
        <p>
          <strong>📅</strong> {dueDate || "No due date"}
        </p>
        <p>
          <strong>⏳</strong> {estimatedDuration} minutes
        </p>
        <p>
          <strong>Category:</strong> {category}
        </p>
        {description && (
          <p>
            <strong>Description:</strong> {description}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    cursor: "pointer",
    marginBottom: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "10px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  category: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    textTransform: "capitalize",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    textTransform: "capitalize",
    marginLeft: "10px",
  },
  details: {
    fontSize: "14px",
    color: "#555",
  },
};

export default TaskItem;
