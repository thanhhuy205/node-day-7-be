require("dotenv").config();

require("./src/config/database");

const tasks = require("./src/tasks");
const queueModel = require("./src/models/queue.model");
const sleep = require("./src/utils/sleep");
const { QUEUE_STATUS } = require("./src/constant/queue");

(async () => {
  while (true) {
    const pendingJob = await queueModel.findOnePending();
    if (pendingJob) {
      const task_name = pendingJob.task_name;
      const payload = JSON.parse(pendingJob.payload);
      const handler = tasks[task_name];
      if (!handler) {
        throw new ApiError(404, `Không tìm thấy hàm xử lí task này "${type}"`);
      }

      try {
        await queueModel.updateStatus(pendingJob.id, QUEUE_STATUS.PROCESSING);
        await handler(payload);
        await queueModel.updateStatus(pendingJob.id, QUEUE_STATUS.SUCCESS);
      } catch (e) {
        await queueModel.updateStatus(pendingJob.id, QUEUE_STATUS.FAILED);
        console.error(String(e));
      }
    }

    await sleep(1000);
  }
})();
