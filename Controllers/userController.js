import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import users from "../Models/userModel.js";

//  Register
export const register = async (req, res) => {
  const { name, email, dateOfBirth, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (existinguser) {
      return res.status(404).json({ message: "User already Exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await users.create({
      name,
      email,
      dateOfBirth,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

//  login 
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await users.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ message: "User don't Exist." });
    }
    const isPasswordCrt = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );
    res.status(200).json({ result: existinguser, token });
  } catch (error) {
    res.status(500).json("Something went worng...");
  }
};

// Get all the user details
export const getAllUsers = async (req, res) => {
    try {
      // Retrieve all users from the database
      const allUsers = await users.find({}, { name: 1, email: 1, dateOfBirth: 1 });
  
      // If no users are found, return an empty array
      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }
  
      // If users are found, return the array of user details
      res.status(200).json(allUsers);
    } catch (error) {
      // If an error occurs, return an error message
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Something went wrong." });
    }
  };
