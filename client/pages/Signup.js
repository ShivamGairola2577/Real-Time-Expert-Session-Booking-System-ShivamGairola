import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup Successful!");
        navigate("/login");
      } else {
        alert(data.message || "Signup Failed");
      }

    } catch (error) {
      alert("Server Error");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
<input
  type="email"
  name="email"
  placeholder="Email"
  autoComplete="new-email"
  value={formData.email}
  onChange={handleChange}
  required
  style={styles.input}
/>

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            style={styles.input}
          />

         <input
  type="text"
  name="username"
  placeholder="Username"
  autoComplete="off"
  value={formData.username}
  onChange={handleChange}
  required
  style={styles.input}
/>

        <input
  type="password"
  name="password"
  placeholder="Password"
  autoComplete="new-password"
  value={formData.password}
  onChange={handleChange}
  required
  style={styles.input}
/>

          <button type="submit" style={styles.signupBtn}>
            Signup
          </button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#247BA0", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9FB6C0",
  },
  card: {
    width: "450px",
    backgroundColor: "#f2f2f2",
    padding: "40px",
    borderRadius: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "30px",
    color: "#1f6f8b",
    fontSize: "26px",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#ffffff",
  },
  signupBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#247BA0",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Signup;
