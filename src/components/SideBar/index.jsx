import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import TaskModal from "../Item/TaskModal";

const SideBar = ({ onUserSelect, onCreateTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = (newTask) => {
    onCreateTask(newTask);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  const menuItems = [
    { to: "/dashboard", icon: "📊", text: "Dashboard" },
    { to: "/taskanalysic", icon: "📝", text: "Analysic Task" },
    { to: "/calendar", icon: "📅", text: "Go to Calendar" },
    { to: "/chatbot", icon: "📅", text: "Chatbot AI" },
  ];

  return (
    <div className="sidebar-user-list">
      <div className="sidebar-content-wrapper">
        <div className="sidebar-add-task-container">
          <button
            onClick={handleAddTaskClick}
            className="sidebar-add-task-button"
          >
            + Add Task
          </button>
        </div>

        {menuItems.map((item, index) => (
          <div key={index} className="sidebar-user-item">
            <Link to={item.to} className="sidebar-user-link">
              <span>{item.icon}</span> {item.text}
            </Link>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateTask={handleCreate}
      />
    </div>
  );
};

export default SideBar;
