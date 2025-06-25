const fs = require("fs").promises;
const path = require("path");
const { put } = require("@vercel/blob");
const { BLOB_CONFIG } = require("../config/vercel-config");

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".vicky_git");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const blob = await put(`commits/${commitDir}/${file}`, fileContent, {
          access: "public",
          token: BLOB_CONFIG.token,
          allowOverwrite: true,
        });

        console.log(`Uploaded: ${blob.url}`);
      }

      // ✅ Upload commit.json
      const commitJsonPath = path.join(commitPath, "commit.json");
      try {
        const commitJson = await fs.readFile(commitJsonPath);
        const blob = await put(`commits/${commitDir}/commit.json`, commitJson, {
          access: "public",
          token: BLOB_CONFIG.token,
          allowOverwrite: true,
        });
        console.log(`✅ Uploaded commit.json: ${blob.url}`);
      } catch (err) {
        console.warn(`⚠️ Warning: commit.json not found for ${commitDir}`);
      }

      // ✅ Upload latest_commit.txt INSIDE the loop (for the current commit)
      try {
        const latestBlob = await put(`latest_commit.txt`, Buffer.from(commitDir), {
          access: "public",
          token: BLOB_CONFIG.token,
          allowOverwrite: true,
        });
        console.log(`📌 Saved latest commit ID: ${commitDir}`);
      } catch (err) {
        console.warn("⚠️ Failed to save latest_commit.txt:", err.message);
      }
    }

    console.log("✅ All commits pushed to Vercel Blob.");
  } catch (err) {
    console.error("❌ Error pushing to Vercel Blob:", err);
  }
}

module.exports = { pushRepo };
