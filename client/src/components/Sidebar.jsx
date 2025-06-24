import React, { useEffect, useState, useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Sidebar() {
  const { logout, onlineUsers, deleteProfile } = useContext(AuthContext);
  const {
    getAllUsers,
    users,
    setSelectedUser,
    selectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const [input, setInput] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState("");

  const handleDelete = () => {
    setActionType("delete");
    setShowConfirmDialog(true);
  };

  const handleLogout = () => {
    setActionType("logout");
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (actionType === "logout") {
      logout();
    } else if (actionType === "delete") {
      deleteProfile();
    }
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, [onlineUsers, getAllUsers]);

  return (
    <>
      <div
        className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
          selectedUser ? "mx-md:hidden" : ""
        }`}
      >
        <div className="py-5">
          <div className="flex justify-between items-center">
            <img src={assets.logo} alt="logo" className="max-w-40" />
            <div className="relative py-2 group">
              <img
                src={assets.menu_icon}
                alt="menu"
                className="cursor-pointer max-h-5"
              />
              <div className="absolute top-full right-0 z-20 rounded-md w-32 p-5 bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer text-sm"
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p className="cursor-pointer text-sm" onClick={handleLogout}>
                  Logout
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p className="cursor-pointer text-sm" onClick={handleDelete}>
                  Delete Profile
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-full bg-[#282142] flex items-center gap-2 py-3 px-4 mt-5">
            <img src={assets.search_icon} alt="search" className="w-3" />
            <input
              type="text"
              value={input}
              onChange={handleInput}
              className="bg-transparent border-none outline-none text-white text-xs 
              placeholder-[#c8c8c8] flex-1"
              placeholder="Search Users"
            />
          </div>
        </div>

        <div className="flex flex-col">
          {filteredUsers.map((user, index) => {
            return (
              <div
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessages((prev) => ({ ...prev, [user?._id]: 0 }));
                }}
                key={index}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                  user?._id === selectedUser?._id && "bg-[#282142]/50"
                }`}
              >
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt="userPp"
                  className="w-[35px] aspect-[1/1] rounded-full"
                />
                <div className="flex flex-col leading-5">
                  <p>{user.fullName}</p>
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-green-400 text-sm">Online</span>
                  ) : (
                    <span className="text-neutral-400 text-sm">Offline</span>
                  )}
                </div>
                {unseenMessages[user._id] > 0 && (
                  <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                    {unseenMessages[user._id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          message={
            actionType === "logout"
              ? "Are you sure you want to logout?"
              : "Are you sure you want to delete your profile?"
          }
          actionType={actionType}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
