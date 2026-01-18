const QUEUE_TYPE = {
  EMAIL: "email",
};

const QUEUE_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
};

const TASK_NAME = {
  SEND_VERIFICATION_EMAIL: "sendVerificationEmail",
  SEND_PASSWORD_CHANGE_EMAIL: "sendPasswordChangeEmail",
};
module.exports = {
  QUEUE_TYPE,
  TASK_NAME,
  QUEUE_STATUS,
};
