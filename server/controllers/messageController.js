import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

//Fetch all users except logged in user
export const getAllUsers = async (req, res) => {
  try {
    //logged-in user ID
    const userId = req.user._id;

    //Filter users
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, unseenMessages, filteredUsers });
  } catch (error) {
    console.log("Error in getting the user! ", error.message);
  }
};

//Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params; // The user you are chatting with
    const loggedInUserId = req.user._id; // The currently logged-in user

    // Find all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: loggedInUserId },
      ],
    });
    // Mark all messages sent *to* the logged-in user as seen
    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: loggedInUserId,
      },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log("Cannot get messages for selected user: ", error.message);
  }
};

//Api to mark messages as seen using messageID
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log("Error marking message as seen: ", error.message);
  }
};

//Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //Emit the new Message in receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log("Error sending message: ", error.message);
  }
};
