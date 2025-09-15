import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { useForm } from "react-hook-form";
const RegisterScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login_name: "",
      password: "",
      first_name: "",
      last_name: "",
      location: "",
      description: "",
      occupation: "",
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log("data sending", data);
      const response = await fetch("http://localhost:8081/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(`Registration failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button
          style={styles.backButton}
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button>
        <span>WELCOME TO MANAGER TIME APP</span>
      </div>
      <div style={styles.mainComponent}>
        <h2 style={styles.login}>Register Form</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label style={styles.name_field}>Username</label>
          <input
            {...register("login_name", { required: "Username is required" })}
            defaultValue="test"
            style={styles.input}
            required={true}
            placeholder="Enter Username"
          />
          {errors.login_name && (
            <span style={styles.error}>{errors.login_name.message}</span>
          )}

          <label style={styles.name_field}>Password</label>
          <input
            {...register("password", { required: "Passeword is required" })}
            style={styles.input}
            type="password"
            placeholder="Enter Password"
          />
          {errors.password && (
            <span style={styles.error}>{errors.password.message}</span>
          )}

          <label style={styles.name_field}>First Name</label>
          <input
            {...register("first_name", { required: "First Name is required" })}
            style={styles.input}
            required={true}
            placeholder="Enter First Name"
          />
          {errors.first_name && (
            <span style={styles.error}>{errors.first_name.message}</span>
          )}
          <label style={styles.name_field}>Last Name</label>
          <input
            {...register("last_name", { required: "Last Name is required" })}
            style={styles.input}
            required={true}
            placeholder="Enter Last Name"
          />
          {errors.last_name && (
            <span style={styles.error}>{errors.last_name.message}</span>
          )}

          <label style={styles.name_field}>Location</label>
          <input
            {...register("location", { required: "Location is required" })}
            style={styles.input}
            required={true}
            placeholder="Enter Location"
          />
          {errors.location && (
            <span style={styles.error}>{errors.location.message}</span>
          )}

          <label tyle={styles.name_field}>Description</label>

          <input
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Enter Description"
            style={styles.input}
            required={true}
          />
          {errors.description && (
            <span style={styles.error}>{errors.description.message}</span>
          )}

          <label style={styles.name_field}>Occupation</label>
          <input
            {...register("occupation", { required: "Occupation is required" })}
            style={styles.input}
            required={true}
            placeholder="Enter Occupation"
          />
          {errors.occupation && (
            <span style={styles.error}>{errors.occupation.message}</span>
          )}
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
          >
            <button style={styles.btn1} type="submit">
              Register Me
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",

    backgroundColor: "#f8f8f8",
  },
  input: { width: "100%", height: 30, marginBottom: 20 },
  topBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: "60px",
    width: "100%",
    backgroundColor: "#0077cc",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: "10px",
    backgroundColor: "white",
    color: "#0077cc",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  mainComponent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "50px",
    width: "40%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  login: { textAlign: "center", marginBottom: "10px" },
  name_field: { display: "block", marginBottom: "5px" },
  text_input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },

  btn1: {
    display: "flex",
    justifyContent: "center",
    padding: "10px 20px",
    backgroundColor: "#0077cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
export default RegisterScreen;
