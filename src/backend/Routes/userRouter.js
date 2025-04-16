const express = require("express");
const { loginUser, signupUser, getAllUsers, deleteUser} = require("../Controller/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/users/signup", signupUser);
router.get("/users", getAllUsers); // Fetch all users
router.delete("/users/:id", deleteUser); // Delete a user

module.exports = router;
