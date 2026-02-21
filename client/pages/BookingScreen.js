import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // If not logged in
    if (!storedUser) {
      setUser(null);
      return;
    }

    // If logged in
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // 🔴 If NOT logged in
  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Please Login First</h2>
          <button
            style={styles.saveBtn}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // 🟢 If logged in
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>My Profile</h2>

        <input
          type="text"
          value={user.name}
          disabled
          style={styles.input}
        />

        <input
          type="email"
          value={user.email}
          disabled
          style={styles.input}
        />

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
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
  saveBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#247BA0",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
  },
  logoutBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#E71D36",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Profile;
