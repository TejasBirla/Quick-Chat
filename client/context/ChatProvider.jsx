import { useContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  //All messages for selected users
  const [messages, setMessages] = useState([]);

  //All users for displaying in sidebar
  const [users, setUsers] = useState([]);

  //Display unseen messages for particular user in key-value pair eg:{1abc:3}
  const [unseenMessages, setUnseenMessages] = useState({});

  const [typingUser, setTypingUser] = useState(null);

  //AuthContext
  const { socket, axios } = useContext(AuthContext);

  //Function to get all users for sidebar
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/get-users");
      if (data.success) {
        setUsers(data.filteredUsers);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //Function to get messages from selected user
  const selectedUserMessage = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/getmessages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //Function to send message to a selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMess) => [...prevMess, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Function to subscribe new messages for selected users
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMess) => [...prevMess, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMess) => ({
          ...prevUnseenMess,
          [newMessage.senderId]: prevUnseenMess[newMessage.senderId]
            ? prevUnseenMess[newMessage.senderId] + 1
            : 1,
        }));
      }
    });

    socket.on("typing", ({ from }) => {
      if (selectedUser?._id === from) {
        setTypingUser(from);
      }
    });

    socket.on("stopTyping", ({ from }) => {
      if (selectedUser?._id === from) {
        setTypingUser(null);
      }
    });
  };

  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit("typing", { receiverId: selectedUser._id });

      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { receiverId: selectedUser._id });
      }, 1500);
    }
  };

  //Function to unsubscribe from messages
  const unsubscribeFromMessages = async () => {
    if (socket) {
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
    }
  };

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
      clearTimeout(window.typingTimeout);
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    typingUser,
    setSelectedUser,
    setUnseenMessages,
    getAllUsers,
    selectedUserMessage,
    sendMessage,
    handleTyping,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
