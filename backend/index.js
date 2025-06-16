const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

yargs(hideBin(process.argv))
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
    commitRepo
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
    revertRepo
  )
  .demandCommand(1, "You need to specify a command")
  .strict()
  .help().argv;
