const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const { BLOB_CONFIG } = require("../config/vercel-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".vicky_git");
  const stagingPath = path.join(repoPath, "staging");
  const blobBaseUrl = "https://a9wmzcwoedtaznnt.public.blob.vercel-storage.com";

  try {
    await fs.mkdir(stagingPath, { recursive: true });

    // ✅ Step 0: Read latest_commit.txt from Blob
    const latestCommitUrl = `${blobBaseUrl}/latest_commit.txt`;
    const latestRes = await axios.get(latestCommitUrl);
    const commitId = latestRes.data.trim();

    console.log(`📌 Latest Commit ID: ${commitId}`);

    // ✅ Step 1: Fetch commit.json
    const commitJsonUrl = `${blobBaseUrl}/commits/${commitId}/commit.json`;
    const commitRes = await axios.get(commitJsonUrl);
    const { files } = commitRes.data;

    // ✅ Step 2: Download all files
    for (const file of files) {
      const fileUrl = `${blobBaseUrl}/commits/${commitId}/${file}`;
      const fileRes = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const fileBuffer = Buffer.from(fileRes.data);

      const localFilePath = path.join(stagingPath, file);
      await fs.writeFile(localFilePath, fileBuffer);

      console.log(`⬇️  Pulled: ${file}`);
    }

    console.log(`✅ Commit ${commitId} pulled into staging area.`);
  } catch (error) {
    console.error("❌ Error pulling commit from Blob:", error.message);
  }
}

module.exports = { pullRepo };
