const fs = require("fs");

const basePath = "./src/tasks";
const postfix = ".task.js";
const entries = fs
  .readdirSync(basePath)
  .filter((fileName) => fileName.endsWith(postfix));

const taskMap = entries.reduce((previousValue, filename) => {
  return {
    ...previousValue,
    [filename.replace(postfix, "")]: require(`./${filename}`),
  };
}, {});

module.exports = taskMap;
