const createRepository = (req, res) => {
  res.send("Repository created!");
};

const getAllRepositories = (req, res) => {
  res.send("List of all repositories!");
};

const fetchedRepositoryById = (req, res) => {
  res.send("Repository fetched!");
};

const fetchedRepositoryByName = (req, res) => {
  res.send("Repository fetched by name!");
};

// Current user repositories
const fetchedCurrentUserRepositories = (req, res) => {
  res.send("Current user repositories fetched!");
};

const updateRepository = (req, res) => {
  res.send("Repository updated!");
};

const toggleRepositoryVisibility = (req, res) => {
  res.send("Repository visibility toggled!");
};

const deleteRepository = (req, res) => {
  res.send("Repository deleted!");
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
