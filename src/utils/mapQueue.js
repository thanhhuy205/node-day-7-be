const mappedPayloadTypeEmail = (user) => {
  return JSON.stringify({ user_id: user.id, email: user.email });
};

module.exports = mappedPayloadTypeEmail;
