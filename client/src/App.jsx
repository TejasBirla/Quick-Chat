import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";
import ForgotPass from "./pages/ForgotPass.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import ResetPass from "./pages/ResetPass.jsx";

export default function App() {
  const { authUser } = useContext(AuthContext);
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/forgot-password"
          element={!authUser ? <ForgotPass /> : <Navigate to="/" />}
        />
        <Route
          path="/verify-otp"
          element={!authUser ? <OtpVerify /> : <Navigate to="/" />}
        />
        <Route
          path="/reset-password"
          element={!authUser ? <ResetPass /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}
