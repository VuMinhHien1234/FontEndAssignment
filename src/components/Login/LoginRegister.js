import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../auth/AuthContext";
function LoginRegister() {
  const {
    register,
    handleSubmit,
    formState: { error },
  } = useForm({
    defaultValues: {
      login_name: "",
      password: "",
    },
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const response = await fetch("http://localhost:8081/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const responseData = await response.json();
      console.log("login data", responseData);
      if (response.ok) {
        alert("Login Successfully");
        login(responseData);
        navigate("/users");
      } else {
        alert(responseData.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleRegister = async () => {
    navigate("/register");
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <span>Please Login</span>
      </div>

      <div style={styles.mainComponent}>
        <h2 style={styles.login}>Login</h2>

        <form onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label htmlFor="username" style={styles.name_field}>
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("login_name", { required: "Username is required" })}
              placeholder="Enter your username"
              style={styles.text_input}
            />
          </div>

          <div>
            <label htmlFor="password" style={styles.name_field}>
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter your password"
              style={styles.text_input}
            />
          </div>
          <button type="submit" style={styles.btn1}>
            Log In
          </button>
        </form>

        <button onClick={handleRegister} style={styles.btn2}>
          Register Me
        </button>
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f8f8",
  },
  topBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
    width: "100%",
    backgroundColor: "#0077cc",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  mainComponent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "50px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  login: { textAlign: "center", marginBottom: "10px" },
  name_field: { display: "block", marginBottom: "5px" },
  text_input: {
    marginBottom: 10,
    width: "95%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  btn1: {
    padding: "10px",
    backgroundColor: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
    marginTop: 20,
  },
  btn2: {
    padding: "10px",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
export default LoginRegister;
