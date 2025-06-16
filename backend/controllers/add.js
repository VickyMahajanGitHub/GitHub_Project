const fs= require("fs/promises");
const path = require("path");

async function addRepo(filePath) {
    const repoPath = path.resolve(process.cwd(), ".vicky_git");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath, fileName));
        console.log(`File ${fileName} added to staging area.`);

    }
    catch (error) {
        console.error("Error adding file to staging area:", error);
    }
}

module.exports = { addRepo };