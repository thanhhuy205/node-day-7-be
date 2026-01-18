const express = require("express");
const responseFormat = require("./src/middlewares/responseFormat");
const notFoundHandler = require("./src/middlewares/notFoundHandler");
const router = require("./src/routes");
const apiRateLimiter = require("./src/middlewares/rateLimiter");
const exceptionHandler = require("./src/middlewares/exceptionHandler");
const taskMap = require("./src/tasks");
require("./queue");
const app = express();

app.use(express.json());
app.use(apiRateLimiter);
app.use(responseFormat);

app.use("/api", router);
app.use(notFoundHandler);
app.use(exceptionHandler);
console.log(taskMap);

app.listen(3000, () => console.log("ok"));
