import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import { generateOTP, generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/messageModel.js";
import sendEmail from "../lib/resendApiMail.js";

//Signup new user function
export const Signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "All fields are required!" });
    }
    if (password.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "email ID already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    return res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Error occur cannot signup user: ", error);
  }
};

//Login user function
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required!" });
    }
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "User does not exists." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    return res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error in login the user: ", error);
  }
};

//Function to check user is authenticated or not
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//Update profile function
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findOneAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findOneAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }
    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Cannot update profile: ", error);
  }
};

//Function to delete user account
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    return res.json({
      success: true,
      message: "User profile and messages deleted.",
    });
  } catch (error) {
    console.log("Error deleting user profile: ", error.message);
  }
};

//Function for forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otpCode = generateOTP(); // 4-digit random number

    await OTP.deleteMany({ email }); // Clean up old OTPs
    await OTP.create({ email, otp: otpCode });

    await sendEmail(
      email,
      "QuickChat - Password Reset OTP",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px; border: 1px solid #ddd;">
          <h2 style="text-align: center; color: #6c63ff;">🔐 QuickChat Password Reset</h2>
          
          <p style="font-size: 16px; color: #333;">
            Hello,
          </p>
    
          <p style="font-size: 16px; color: #333;">
            We received a request to reset the password associated with this email address. Use the OTP below to proceed:
          </p>
    
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #6c63ff; background-color: #fff; padding: 12px 20px; border: 2px dashed #6c63ff; border-radius: 8px;">
              ${otpCode}
            </span>
          </div>
    
          <p style="font-size: 14px; color: #666;">
            ⚠️ This OTP is valid for <strong>90 seconds</strong> and can be used only once.
          </p>
    
          <p style="font-size: 14px; color: #666;">
            If you didn't request this, please ignore this email or contact our support team immediately.
          </p>
    
          <p style="font-size: 16px; color: #333;">
            Regards,<br/>
            <strong>QuickChat Security Team</strong>
          </p>
        </div>
      `
    );

    res.json({ success: true, message: "OTP has been sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Function to verify Otp
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Function to reset password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      return res.json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await OTP.deleteMany({ email }); // Clean up OTP

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
