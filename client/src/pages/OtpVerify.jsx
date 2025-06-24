import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

export default function OtpVerify() {
  const { verifyOtp } = useContext(AuthContext);

  const [otpVal, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(90);
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const  email  = localStorage.getItem("forgotPassEmail");

  useEffect(() => {
    const storedStartTime = localStorage.getItem("otpStartTime");
    if (storedStartTime) {
      const elapsed = Math.floor(
        (Date.now() - parseInt(storedStartTime)) / 1000
      );
      const remaining = 90 - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const newOtp = [...otpVal];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpVal[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOTP = () => {
    if (otpVal.includes("")) return;

    const otp = otpVal.join("");
    setLoading(true);
    verifyOtp({ email, otp });
    setLoading(false);
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

      <div className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg w-[370px]">
        <h1 className="font-medium font-2xl flex justify-between items-center">
          OTP Verification
        </h1>
        <input
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2  focus:ring-indigo-500 text-white"
          type="email"
          value={email}
          readOnly
        />
        <div className="flex justify-center gap-8">
          {otpVal.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              maxLength={1}
              inputMode="numeric"
              className="w-12 h-12 text-center border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-xl"
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-300">
          {timeLeft > 0
            ? `This OTP will expire in ${timeLeft}s`
            : "OTP expired. Please request a new one."}
        </p>

        <button
          type="submit"
          onClick={handleOTP}
          className={`py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer  ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
