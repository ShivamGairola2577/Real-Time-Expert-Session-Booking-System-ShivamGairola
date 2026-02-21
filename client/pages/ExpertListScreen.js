import React, { useEffect, useState } from "react";

function DisplayListingScreen() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [slot, setSlot] = useState("");

  // Dropdown options from backend
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [prices, setPrices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState("");

  // Booking modal
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  /////////////////////////////////////////////////////////////
  // Fetch dropdown options from backend
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    fetch("http://localhost:5000/filter-options")
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setRegions(data.regions || []);
        setCountries(data.countries || []);
        setRatings(data.ratings || []);
        setPrices(data.prices || []);
        setSlots(data.slots || []);
      })
      .catch(err => console.error("Filter options error:", err));
  }, []);

  /////////////////////////////////////////////////////////////
  // Fetch experts from backend with filters
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (region) params.append("region", region);
    if (country) params.append("country", country);
    if (rating) params.append("minRating", rating);
    if (price) params.append("maxPrice", price);
    if (slot) params.append("minSlot", slot);

    fetch(`http://localhost:5000/filter-experts?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setExperts(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Experts fetch error:", err);
        setLoading(false);
      });

  }, [search, category, region, country, rating, price, slot]);

  /////////////////////////////////////////////////////////////
  // Booking
  /////////////////////////////////////////////////////////////
  const handleBooking = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Select date and time");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const response = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

        setExperts(prev =>
          prev.map(exp =>
            exp._id === selectedExpert._id
              ? { ...exp, slot: data.updatedSlot }
              : exp
          )
        );

        setSelectedExpert(null);
        setSelectedDate("");
        setSelectedTime("");
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Server error");
    }
  };

  /////////////////////////////////////////////////////////////
  // UI
  /////////////////////////////////////////////////////////////
  return (
    <div style={{ padding: "20px" }}>
      <h2>Expert Listings</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
<input
  type="text"
  placeholder="Search by Name..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "8px",
    width: "100%",
    marginBottom: "15px"
  }}
/>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="">Select Region</option>
          {regions.map((reg, i) => (
            <option key={i} value={reg}>{reg}</option>
          ))}
        </select>

        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          {countries.map((con, i) => (
            <option key={i} value={con}>{con}</option>
          ))}
        </select>

        <select value={rating} onChange={e => setRating(e.target.value)}>
          <option value="">Min Rating</option>
          {ratings.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>

        <select value={price} onChange={e => setPrice(e.target.value)}>
          <option value="">Max Price</option>
          {prices.map((p, i) => (
            <option key={i} value={p}>₹{p}</option>
          ))}
        </select>

        <select value={slot} onChange={e => setSlot(e.target.value)}>
          <option value="">Min Slots</option>
          {slots.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>

      </div>

      {loading && <p>Loading experts...</p>}

      {!loading && experts.length === 0 && (
        <p>No experts found.</p>
      )}

      {/* Expert Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 20
      }}>
        {experts.map(expert => (
          <div
            key={expert._id}
            onClick={() => expert.slot > 0 && setSelectedExpert(expert)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              cursor: expert.slot > 0 ? "pointer" : "not-allowed",
              opacity: expert.slot <= 0 ? 0.6 : 1
            }}
          >
            <h3>{expert.name}</h3>
            <p>Category: {expert.category}</p>
            <p>Region: {expert.region}</p>
            <p>Country: {expert.country}</p>
            <p>Rating: ⭐ {expert.rating}</p>
            <p>Price: ₹{expert.price}</p>
            <p>Available Slots: {expert.slot}</p>

            {expert.slot <= 0 && (
              <p style={{ color: "red" }}>Fully Booked</p>
            )}
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedExpert && (
        <div style={modal.overlay}>
          <div style={modal.box}>
            <h2>Book Appointment</h2>
            <p><strong>Name:</strong> {selectedExpert.name}</p>
            <p><strong>Category:</strong> {selectedExpert.category}</p>
            <p><strong>Price:</strong> ₹{selectedExpert.price}</p>
            <p><strong>Available Slots:</strong> {selectedExpert.slot}</p>

            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={modal.input}
            />

            <input
              type="time"
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
              style={modal.input}
            />

            <div style={{ marginTop: 20 }}>
              <button style={modal.confirm} onClick={handleBooking}>
                Confirm Booking
              </button>
              <button style={modal.cancel}
                onClick={() => setSelectedExpert(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modal = {
  overlay: {
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
  box: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    width: 400
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 10
  },
  confirm: {
    backgroundColor: "green",
    color: "white",
    padding: "10px 15px",
    border: "none",
    marginRight: 10
  },
  cancel: {
    backgroundColor: "red",
    color: "white",
    padding: "10px 15px",
    border: "none"
  }
};

export default DisplayListingScreen;
