require("dotenv").config();

const BLOB_CONFIG = {
  token: process.env.BLOB_READ_WRITE_TOKEN,
};

module.exports = { BLOB_CONFIG };
