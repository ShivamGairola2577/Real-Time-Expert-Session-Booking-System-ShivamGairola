import React, { useEffect, useState, useRef } from "react";
import BookingHistory from "./BookingHistory";
import mainImage from "./logo.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import Profile from "./Profile";
import Signup from "./Signup";
import DisplayListingScreen from "./DisplayListingScreen";
import ExpertDetailScreen from "./ExpertDetailScreen";
// Home Component (same content, unchanged)
function Home() {
  return (
    <>
      {/* HERO SECTION */}
    <div style={styles.hero} className="hero-section">
       <div style={styles.left} className="hero-left">
          <h1 style={styles.heading}>
            Real-Time Appointment Booking Application
          </h1>

          <p style={styles.paragraph}>
            The Real-Time Appointment Booking Application is a smart and efficient scheduling platform designed to simplify the way users connect with professionals. In today’s fast-paced world, managing appointments manually can be confusing, time-consuming, and prone to errors. Our platform eliminates these challenges by providing a streamlined, automated, and real-time booking experience.
            Users can easily browse available professionals, explore their profiles, check their available time slots, and confirm appointments instantly. The system ensures that all time slots are updated in real-time, preventing scheduling conflicts and double bookings. This creates a smooth and reliable experience for both users and professionals.
            Whether you are booking a consultation, guidance session, mentoring call, or professional service, this application makes the entire process quick, transparent, and organized
          </p>
        </div>

        <div style={styles.right}>
          <img src={mainImage} alt="shopping" style={styles.image} />
        </div>
        
      </div>
          <ExpertsSection />
    </>
    
  );
}

//expert section 
function ExpertsSection() {
  const [experts, setExperts] = useState({});
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
const [selectedTime, setSelectedTime] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/experts")
      .then(res => res.json())
      .then(data => setExperts(data))
      .catch(err => console.error("Error fetching experts:", err));
  }, []);

const handleBooking = async () => {

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    alert("Please login first");
    return;
  }

  const user = JSON.parse(storedUser);

  if (!user.id) {
    alert("Invalid session. Please login again.");
    return;
  }

  if (!selectedDate) {
    alert("Please select date");
    return;
  }

  if (!selectedTime) {
    alert("Please select time");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        expertId: selectedExpert._id,
        date: selectedDate,
        time: selectedTime
      })
    });

    const data = await response.json();

    if (response.ok) {

      alert("Booking Confirmed!");

      // ✅ 1. Decrease slot in UI instantly
      setExperts(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(category => {
          updated[category] = updated[category].map(exp =>
            exp._id === selectedExpert._id
              ? { ...exp, slot: exp.slot - 1 }
              : exp
          );
        });

        return updated;
      });

      // ✅ 2. Close modal automatically
      setSelectedExpert(null);

      // ✅ 3. Reset date & time
      setSelectedDate("");
      setSelectedTime("");

    } else {
      alert(data.message);
    }

  } catch (error) {
    alert("Server error");
  }
};

  return (
    <div style={{ marginTop: "50px" }}>
      
      {Object.keys(experts).map((category) => (
        <div key={category} style={{ marginBottom: "60px" }}>
          <h2 style={{ textAlign: "center" }}>{category}</h2>

          <div style={styles.horizontalScroll}>
            {experts[category].map((item) => (
              <div
                key={item._id}   // ✅ correct key
                style={{
                  ...styles.expertCard,
                  opacity: item.slot <= 0 ? 0.6 : 1,
                  cursor: item.slot <= 0 ? "not-allowed" : "pointer"
                }}
                onClick={() => {
                  if (item.slot > 0) {
                    setSelectedExpert(item);
                  }
                }}
              >
                <h3>{item.name}</h3>
                <p><strong>Phone:</strong> {item.phone}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Region:</strong> {item.region}</p>
                <p><strong>Country:</strong> {item.country}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Rating:</strong> ⭐ {item.rating}</p>
                <p><strong>Slots:</strong> {item.slot}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>

                {item.slot <= 0 && (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    Fully Booked
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ===== MODAL ===== */}
      {selectedExpert && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Book Appointment</h2>

            <p><strong>Name:</strong> {selectedExpert.name}</p>
            <p><strong>Category:</strong> {selectedExpert.category}</p>
            <p><strong>Price:</strong> ₹{selectedExpert.price}</p>
            <p><strong>Available Slots:</strong> {selectedExpert.slot}</p>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={styles.dateInput}
            />
         
         <input
  type="time"
  value={selectedTime}
  onChange={(e) => setSelectedTime(e.target.value)}
  style={styles.dateInput}
/>
            <div style={{ marginTop: "20px" }}>
              <button
                style={styles.confirmBtn}
                onClick={handleBooking}
              >
                Confirm Booking
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setSelectedExpert(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// Simple Login Page (temporary)


function App() {
  return (
    <Router>

      {/* NAVBAR */}
    <div style={styles.navbar} className="mobile-navbar">
        <div style={styles.navLinks}>
         <Link to="/" style={styles.link}>Home</Link> 
         <Link to="/profile" style={styles.link}>Profile</Link> 
         <Link to="/booking-history" style={styles.link}> Booking History </Link>
          <Link to="/signup" style={styles.link}>Signup</Link> 
          <Link to="/login" style={styles.link}>Login</Link>
         <Link to="/experts" style={styles.link}>
  Expert Detail Screen
</Link>
<Link to="/listings" style={styles.link}>Listings</Link>
        </div>

      
      </div>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
     <Route path="/booking-history" element={<BookingHistory />} />
  <Route path="/experts" element={<ExpertDetailScreen />} />
  <Route path="/listings" element={<DisplayListingScreen />} />
      </Routes>
<style>
{`
@media (max-width: 768px) {

  /* Navbar scroll */
  .mobile-navbar {
    overflow-x: auto;
    white-space: nowrap;
  }

  .mobile-navbar a {
    display: inline-block;
    margin-right: 15px;
  }

  /* Hero responsive */
  .hero-section {
    flex-direction: column !important;
    height: auto !important;
    padding: 20px 0 !important;
  }

  /* Text section */
  .hero-left {
    width: 100% !important;
    padding: 0 15px !important;
    box-sizing: border-box;
    text-align: center !important;
  }

  .hero-left h1 {
    width: 100%;
    font-size: 28px !important;
    line-height: 1.3;
  }

  .hero-left p {
    width: 100%;
    font-size: 16px;
    line-height: 1.6;
  }

  /* Image section */
  .hero-right {
    width: 100% !important;
    text-align: center !important;
  }

  .hero-right img {
    width: 100% !important;
    height: auto !important;
  }

}
`}
</style>
    </Router>
  );
}

const styles = {
  navbar: {
    width: "100%",
    backgroundColor: "#787A7A",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 5%",
    boxSizing: "border-box",
  },
  navLinks: {
    display: "flex",
    gap: "25px",
  },
  link: {
    textDecoration: "none",
    color: "purple",
    fontWeight: "500",
  },
  search: {
    padding: "8px",
    width: "200px",
  },
  hero: {
    width: "100vw",
    height: "70vh",
    backgroundColor: "#787A7A",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    boxSizing: "border-box",
  },
  left: {
    width: "60%",
    color: "black",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "0px",
  },
  paragraph: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  right: {
    width: "35%",
    display: "flex",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "auto",
  },
  horizontalScroll: {
  display: "flex",
  overflowX: "auto",
  gap: "20px",
  padding: "20px",
  backgroundColor: "#8CA3B3"
},

expertCard: {
  minWidth: "260px",
  backgroundColor: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
},
modalOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
},

modal: {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
},

dateInput: {
  width: "100%",
  padding: "8px",
  marginTop: "10px"
},

confirmBtn: {
  padding: "10px 15px",
  marginRight: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  cursor: "pointer"
},

cancelBtn: {
  padding: "10px 15px",
  backgroundColor: "red",
  color: "white",
  border: "none",
  cursor: "pointer"
},
};

export default App;
