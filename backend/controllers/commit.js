const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".vicky_git");
  const stagePath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    const stagedFiles = await fs.readdir(stagePath);
    if (stagedFiles.length === 0) {
      console.log("No files to commit.");
      return;
    } else {
      for (const file of stagedFiles) {
        await fs.copyFile(
          path.join(stagePath, file),
          path.join(commitDir, file)
        );
      }
      // Write commit metadata to a file
      await fs.writeFile(
        path.join(commitDir, "commit.json"),
        JSON.stringify(
          {
            commitId: commitId,
            message: message,
            timestamp: new Date().toISOString(),
            files: stagedFiles,
          },
          null,
          2
        )
      );
      console.log(`Changes committed with ID: ${commitId} and message: "${message}"`);
      // Clear the staging area after commit
    }
  } catch (error) {
    console.error("Error committing changes:", error);
  }
}

module.exports = { commitRepo };
