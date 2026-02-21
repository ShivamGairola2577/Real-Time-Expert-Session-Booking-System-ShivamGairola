import React, { useEffect, useState } from "react";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }
fetch(`http://localhost:5000/history/${user.id}`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Booking History</h1>

      {bookings.length === 0 ? (
        <p style={{ textAlign: "center" }}>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={styles.card}>
            
            <div style={styles.details}>
              <h2 style={styles.expertName}>{booking.expertName}</h2>

              <p>
                <strong>Date:</strong> {booking.date}
              </p>

              <p>
                <strong>Time:</strong> {booking.time}
              </p>

             <p>
  <strong>Status:</strong>{" "}
  <span
    style={{
      color:
        booking.status === "Completed"
          ? "blue"
          : "green",
      fontWeight: "bold"
    }}
  >
    {booking.status}
  </span>
</p>
            </div>

            <button style={styles.cancelBtn}>
              Cancel
            </button>

          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#9FB6C0",
    padding: "50px"
  },
  heading: {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "32px"
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: "30px",
    borderRadius: "20px",
    marginBottom: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  expertName: {
    marginBottom: "10px"
  },
  cancelBtn: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "10px 25px",
    borderRadius: "10px",
    cursor: "pointer"
  }
};

export default BookingHistory;
