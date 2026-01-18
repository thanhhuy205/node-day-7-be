const fs = require("fs");
const prefix = ".task.js";
const baseFolder = "./src/tasks";

const taskFile = fs.readdirSync(baseFolder).filter((f) => f.endsWith(prefix));

const tasksMap = taskFile.reduce((obj, taskName) => {
  return {
    ...obj,
    [taskName.replace(prefix, "")]: require(`./${taskName}`),
  };
}, {});

module.exports = tasksMap;
