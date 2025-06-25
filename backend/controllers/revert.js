const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".vicky_git");
  const commitsPath = path.join(repoPath, "commits", commitID);
  const stagingPath = path.join(repoPath, "staging");
  const projectRoot = process.cwd();

  try {
    const files = await fs.readdir(commitsPath);
    await fs.mkdir(stagingPath, { recursive: true });

    for (const file of files) {
      if (file === "commit.json") continue;

      const srcPath = path.join(commitsPath, file);
      const stagingFilePath = path.join(stagingPath, file);
      const liveFilePath = path.join(projectRoot, file);

      // Copy to staging
      await fs.copyFile(srcPath, stagingFilePath);
      // Copy to live project root
      await fs.copyFile(srcPath, liveFilePath);

      console.log(`↩️  Reverted: ${file}`);
    }

    console.log(`✅ Reverted to commit: ${commitID} (staging + working dir)`);
  } catch (err) {
    console.error("❌ Error reverting repository:", err.message);
  }
}

module.exports = { revertRepo };
