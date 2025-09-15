import React, { useState, useContext, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./auth/AuthContext";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import AIAnalyzer from "./components/ChatBot/index";
import "./App.css";
import Calendar from "./components/Calendar";
import Home from "./components/Home/Home";
import TotalTask from "./components/Dashboard/DetailsTask/TotalTask";
import CompletedTasks from "./components/Dashboard/DetailsTask/CompletedTasks";
import PendingTasks from "./components/Dashboard/DetailsTask/PendingTasks";
import OverdueTasks from "./components/Dashboard/DetailsTask/OverdueTasks";
function App() {
  const { user } = useContext(AuthContext);
  const [selectedUserName, setSelectedUserName] = useState(
    user?.username || ""
  );
  const triggerFetch = useRef(null);

  const handleUserSelect = (userName) => {
    setSelectedUserName(userName);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <TopBar selectedUserName={selectedUserName} triggerFetch={triggerFetch} />
      <div className="main-container">
        <div className="sidebar">
          <SideBar onUserSelect={handleUserSelect} />
        </div>
        <div className="content">
          <Routes>
            <Route
              path="/dashboard"
              element={<Dashboard onUserSelect={handleUserSelect} />}
            />

            <Route path="/totaltask" element={<TotalTask />} />
            <Route path="/completedtask" element={<CompletedTasks />} />
            <Route path="/pendingtask" element={<PendingTasks />} />
            <Route path="/overduetask" element={<OverdueTasks />} />

            <Route path="/calendar" element={<Calendar />} />
            <Route path="/taskanalysic" element={<Home />} />
            <Route path="/chatbot" element={<AIAnalyzer />} />

            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
