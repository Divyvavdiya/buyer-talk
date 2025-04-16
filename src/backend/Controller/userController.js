const bcrypt = require("bcrypt");
const UserModel = require("../Models/userModel")
const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key"; 

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 }); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await UserModel.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};


// User Login
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });
        
        if (user.role !== role) return res.status(400).json({ message: "Role mismatch. Please select the correct role." });

        const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        res.json({
             message: "Login successful",
              token, 
              user: {
                _id: user._id, 
                 name:user.name, 
                 email: user.email,
                  role: user.role, 
                  createdAt: user.createdAt,
                  updatedAt: user.updatedAt 
                } 

            });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// User Signup
const signupUser = async (req, res) => {
    const { name,email, password, role } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        const newUser = new UserModel({ name, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
         });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
module.exports = { loginUser, signupUser, getAllUsers, deleteUser };
