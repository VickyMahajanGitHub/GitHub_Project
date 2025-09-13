const express = require("express");

const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createRepository = async (req, res) => {
  const { userId, name, issues, description, content, visibility } = req.body;
  try {
    if (!name) {
      return res.status(400).json("Repository name is required");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json("Invalid User ID");
    }
    // if(!mongoose.Types.ObjectId.isValid(issues)) {
    //   return res.status(400).json("Invalid Issue ID");
    // }

    const newRepository = new Repository({
      name,
      description,
      content,
      visibility,
      owner: userId,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created successfully!",
      repositoryID: result._id,
    });

    // await newRepository.save();
    // res.status(201).json("Repository created!");
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("Owner")
      .populate("issues");
    res.status(200).json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).send("Internal Server Error");
  }
};

const fetchedRepositoryById = async (req, res) => {
  const repoID = req.params.id;
  try {
    if (!repoID) {
      return res.status(400).json("Repository ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(repoID)) {
      return res.status(400).json("Invalid Repository ID");
    }

    const repository = await Repository.findById(repoID)
      .populate("Owner")
      .populate("issues");
    res.status(200).json(repository);
  } catch (error) {
    console.error("Error fetching repository by ID:", error);
    res.status(500).send("Internal Server Error");
  }
};

const fetchedRepositoryByName = async (req, res) => {
  const repoName = req.params.name;
  try {
    if (!repoName.trim()) {
      return res.status(400).json("Repository name is required");
    }

    const repository = await Repository.findOne({ name: repoName })
      .populate("Owner")
      .populate("issues");
    res.status(200).json(repository);
  } catch (error) {
    console.error("Error fetching repository by ID:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Current user repositories
const fetchedCurrentUserRepositories = async (req, res) => {
  const userID = req.params.userId;
  try {
    const repositories = await Repository.find({ Owner: userID })
      .populate("Owner")
      .populate("issues");

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }

    return res
      .status(200)
      .json({ message: "Repositories found", repositories });
  } catch (error) {
    console.error("Error fetching current user repositories:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const updateRepository = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json("Repository not found");
    }

    repository.content.push(content);
    repository.description = description;
    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      updatedRepository,
    });
  } catch (error) {
    console.error("Error updating repository:", error);
    res.status(500).send("Internal Server Error");
  }
};

const toggleRepositoryVisibility = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json("Repository not found");
    }

    repository.isPrivate = !repository.isPrivate;
    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      updatedRepository,
    });
  } catch (error) {
    console.error("Error toggling repository visibility:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteRepository = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json("Repository not found");
    }
    res.json({ message: "Repository deleted successfully!" });
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchedRepositoryById,
  fetchedRepositoryByName,
  fetchedCurrentUserRepositories,
  updateRepository,
  toggleRepositoryVisibility,
  deleteRepository,
};
