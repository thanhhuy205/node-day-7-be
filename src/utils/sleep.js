function sleep(ms, multi = 1) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms * multi);
  });
}

module.exports = sleep;
