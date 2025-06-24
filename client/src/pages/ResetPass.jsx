import React from "react";
import assets from "../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ResetPass() {
  const { resetPassword } = useContext(AuthContext);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email = localStorage.getItem("forgotPassEmail");

  const handlePassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleResetPass = (event) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword === confirmPassword) {
      resetPassword({ email, newPassword });
    } else {
      toast.error("Passwords do not match.");
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly
  max-sm:flex-col backdrop-blur-2xl"
    >
      <img
        src={assets.logo_big}
        alt="AppLogo"
        className="w-[min(30vw,250px)]"
      />
      <form className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[370px]">
        <h1 className="font-medium font-2xl flex justify-between items-center">
          Reset Password
        </h1>
        <input
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
          type="email"
          value={email}
          readOnly
        />
        <input
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
          type="password"
          value={newPassword}
          onChange={handlePassword}
          placeholder="New password"
          required
        />
        <input
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
          placeholder="Confirm New password"
          required
        />
        <button
          type="submit"
          onClick={handleResetPass}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
