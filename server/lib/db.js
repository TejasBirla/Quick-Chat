import mongoose from "mongoose";

//Function to connect mongodb database
export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/chat-app`);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Cannot connect to database!", error);
  }
};
