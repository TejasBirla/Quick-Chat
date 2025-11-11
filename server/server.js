import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import MessageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

//Create express app , HTTP server and PORT
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

//Initialize socket.io server
export const io = new Server(server, { cors: { origin: "*" } });

//Store online users
export const userSocketMap = {}; //{userId: socketId}

//Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected: ", userId);

  if (userId) userSocketMap[userId] = socket.id;

  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  //Typing event
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        from: userId,
      });
    }
  });

  //Stop typing event
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", {
        from: userId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//Routes setup
app.use("/api/auth", userRouter);
app.use("/api/messages", MessageRouter);

//Connect to mongodb
await connectDB();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//PORT running
server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
