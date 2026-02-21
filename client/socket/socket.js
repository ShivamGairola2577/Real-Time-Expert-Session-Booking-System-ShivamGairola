import { io } from "socket.io-client";

let socket = null;

// ================= CREATE CONNECTION =================
export const connectSocket = () => {
  if (socket) return socket;

  const user = JSON.parse(localStorage.getItem("user"));

  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    auth: {
      token: user?.token || null
    }
  });

  // ===== CONNECTION EVENTS =====
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("⚠ Socket connection error:", err.message);
  });

  return socket;
};

// ================= DISCONNECT =================
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ================= JOIN EXPERT ROOM =================
export const joinExpertRoom = (expertId) => {
  if (!socket) return;
  socket.emit("joinExpertRoom", expertId);
};

// ================= LEAVE EXPERT ROOM =================
export const leaveExpertRoom = (expertId) => {
  if (!socket) return;
  socket.emit("leaveExpertRoom", expertId);
};

// ================= LISTEN SLOT UPDATE =================
export const onSlotUpdated = (callback) => {
  if (!socket) return;
  socket.on("slotUpdated", callback);
};

// ================= REMOVE SLOT LISTENER =================
export const offSlotUpdated = () => {
  if (!socket) return;
  socket.off("slotUpdated");
};

// ================= LISTEN NEW BOOKING =================
export const onBookingCreated = (callback) => {
  if (!socket) return;
  socket.on("bookingCreated", callback);
};

// ================= EMIT BOOKING EVENT =================
export const emitBookingCreated = (data) => {
  if (!socket) return;
  socket.emit("bookingCreated", data);
};

export default socket;
