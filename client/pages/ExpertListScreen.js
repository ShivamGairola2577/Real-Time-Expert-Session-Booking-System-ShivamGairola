import React, { useEffect, useState } from "react";

function ExpertDetailScreen() {

  const [experts, setExperts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const expertsPerPage = 40;

  useEffect(() => {
    fetch("http://localhost:5000/all-experts") // ✅ IMPORTANT
      .then(res => res.json())
      .then(data => {
        setExperts(data);
      })
      .catch(err => console.error(err));
  }, []);

  const indexOfLast = currentPage * expertsPerPage;
  const indexOfFirst = indexOfLast - expertsPerPage;
  const currentExperts = experts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(experts.length / expertsPerPage);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Experts</h1>

      <div style={styles.grid}>
        {currentExperts.map((item) => (
          <div key={item._id} style={styles.card}>
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

      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              ...styles.pageBtn,
              backgroundColor: currentPage === i + 1 ? "#333" : "#ccc",
              color: currentPage === i + 1 ? "white" : "black"
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#8CA3B3",
    minHeight: "100vh",
    padding: "30px"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    gap: "10px"
  },
  pageBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default ExpertDetailScreen;
