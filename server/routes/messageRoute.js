import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  getAllUsers,
  getMessages,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const MessageRouter = express.Router();

MessageRouter.get("/get-users", protectRoute, getAllUsers);
MessageRouter.get("/getmessages/:id", protectRoute, getMessages);
MessageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
MessageRouter.post("/send/:id", protectRoute, sendMessage);

export default MessageRouter;
