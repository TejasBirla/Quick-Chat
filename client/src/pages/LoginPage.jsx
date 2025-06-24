import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const [currState, setCurrState] = useState("Signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    if (currState === "Signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Signup" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly
    max-sm:flex-col backdrop-blur-2xl"
    >
      {/* ----->Left side-----> */}
      <img
        src={assets.logo_big}
        alt="AppLogo"
        className="w-[min(30vw,250px)]"
      />
      {/* ----->Right side-----> */}
      <form className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[370px]">
        <h1 className="font-medium font-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="arrowIcon"
              className="w-5 cursor-pointer"
            />
          )}
        </h1>
        {currState === "Signup" && !isDataSubmitted && (
          <input
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
            <input
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {currState === "Login" && (
              <p
                className="cursor-pointer font-medium text-violet-500"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>
            )}
          </>
        )}

        {currState === "Signup" && isDataSubmitted && (
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500"
            placeholder="Enter your bio..."
          ></textarea>
        )}
        <button
          type="submit"
          onClick={submitHandler}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Signup" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currState === "Signup" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setBio("");
                  setIsDataSubmitted(false);
                }}
                className="cursor-pointer font-medium text-violet-500"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account{" "}
              <span
                onClick={() => {
                  setCurrState("Signup");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setBio("");
                  setIsDataSubmitted(false);
                }}
                className="cursor-pointer font-medium text-violet-500"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
