const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/users/allUsers", userController.getAllUsers);
userRouter.post("/users/signup", userController.signup);
userRouter.post("/users/login", userController.login);
userRouter.get("/users/getUserProfile/:id", userController.getUserProfile);
userRouter.put("/users/updateUserProfile/:id", userController.updateUserProfile);
userRouter.delete("/users/deleteUserProfile/:id", userController.deleteUserProfile);

module.exports = userRouter;
