const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const mainRouter =require("./routes/main.router");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Start the project", {}, startServer)
  
  .command("init", "Initialize the project", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the project",
    (yargs) => {
      yargs.positional("file", {
        describe: "The file to add to staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )

  .command(
    "commit <message>",
    "Commit changes to the project",
    (yargs) => {
      yargs.positional("message", {
        describe: "The commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push changes to the remote repository", {}, pushRepo)
  .command("pull", "Pull changes from the remote repository", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert changes to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "The commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need to specify a command")
  .strict()
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());
  app.use(express.json());
  

  const mongoURI = process.env.MONGO_URI;
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });

  app.use(cors( {origin:"*"} )); // Allow all origins/domains for CORS

  app.use("/", mainRouter);

 

  let user = "Vicky";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins for WebSocket connections
      methods: ["GET", "POST"],
    },
  });


  io.on("connection",(socket)=> {
    socket.on("joinRoom",(userID) => {
      user = userID;
      console.log("=======")
      console.log(`${user} has joined the room`);
      console.log("=======")
      socket.join(userID);
    });
  });

  const db= mongoose.connection;
  db.once("open", async () => {
    console.log("MongoDB connection established successfully || CRUD operations"); // CRUD operations can be performed here
    
    // Emit an event to notify clients that the server is ready
    io.emit("serverReady", { message: "Server is ready", user });
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  

}
