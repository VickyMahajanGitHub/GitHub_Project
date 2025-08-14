const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchedRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchedRepositoryByName);
repoRouter.get("/repo/user/:UserId", repoController.fetchedCurrentUserRepositories);
repoRouter.put("/repo/:id", repoController.updateRepository);
repoRouter.patch(
  "/repo/:id/toggle-visibility",
  repoController.toggleRepositoryVisibility
);
repoRouter.delete("/:id", repoController.deleteRepository);

module.exports = repoRouter;
