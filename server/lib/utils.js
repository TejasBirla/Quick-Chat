import jwt from "jsonwebtoken";

//Function to generate token for user
export const generateToken = (userId, expiresIn) => {
  const payload = { userId };

  const options = expiresIn ? { expiresIn } : undefined;

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
};

//Function to generate 4 digits OTPs
export const generateOTP = () =>
  Math.floor(1000 + Math.random() * 9000).toString();
