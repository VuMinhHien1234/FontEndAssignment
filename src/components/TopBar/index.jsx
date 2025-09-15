import React, { useContext, useState } from "react";
import "./styles.css";
import { AuthContext } from "../../auth/AuthContext";

function TopBar({ selectedUserName, triggerFetch }) {
  const { user, login, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8081/admin/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Logged out successfully");
        logout();
      } else {
        console.error("Logout failed:", data.error);
        alert(data.error || "Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {user ? (
          <div className="user-section">
            <h2>Welcome, {user.user.login_name}</h2>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="user-section">
            <span>Please Login</span>
            <button className="login-button" onClick={login}>
              Login
            </button>
          </div>
        )}
      </div>
      <div className="topbar-right">
        <h1 className="logo">{selectedUserName || "Manager Time App"}</h1>
      </div>
    </div>
  );
}

export default TopBar;
