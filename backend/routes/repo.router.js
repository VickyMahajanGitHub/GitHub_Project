const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/create", repoController.createRepository);
repoRouter.get("/all", repoController.getAllRepositories);
repoRouter.get("/:id", repoController.fetchedRepositoryById);
repoRouter.get("/name/:name", repoController.fetchedRepositoryByName);
repoRouter.get("/user/:UserId", repoController.fetchedCurrentUserRepositories);
repoRouter.put("/:id", repoController.updateRepository);
repoRouter.patch(
  "/:id/toggle-visibility",
  repoController.toggleRepositoryVisibility
);
repoRouter.delete("/:id", repoController.deleteRepository);

module.exports = repoRouter;
