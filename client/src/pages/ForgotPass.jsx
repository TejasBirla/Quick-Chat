import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useState } from "react";
import assets from "../assets/assets.js";

export default function ForgotPass() {
  const { forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    forgotPassword(email)
      .then(() => {
        localStorage.setItem("forgotPassEmail", email);
        localStorage.setItem("otpStartTime", Date.now().toString());
      })
      .finally(() => setLoading(false));
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
          Forgot Password
        </h1>
        <input
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
          type="email"
          value={email}
          onChange={handleEmail}
          placeholder="Email address"
          required
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className={`py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer  ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
