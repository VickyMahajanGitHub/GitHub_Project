const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
var ObjectId = require("mongodb").ObjectId;

const uri = process.env.MONGO_URI;

let client;
let db;

// MongoDB connection
async function connectionClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    db = client.db("githubclone");
    console.log("MongoDB connected");
  }
  return db;
}

// Helper: Get Users collection
async function getUsersCollection() {
  const database = await connectionClient();
  return database.collection("users");
}

// Signup route
async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    const usersCollection = await getUsersCollection();

    // Check if username or email already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, userId: result.insertedId});
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Login route
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const usersCollection = await getUsersCollection();

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// CRUD Operation

// Get all users (sample)
async function getAllUsers(req, res) {
  try {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserProfile(req, res) {
  const currentId = req.params.id;
  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(currentId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      repositories: user.repositories,
      followedUsers: user.followedUsers,
      starRepos: user.starRepos,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUserProfile(req, res) {
  const currentId = req.params.id;
  const { username, email } = req.body;
  try {
    const usersCollection = await getUsersCollection();
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(currentId) },
      { $set: { username, email } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;

  try {
    const usersCollection = await getUsersCollection();
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
