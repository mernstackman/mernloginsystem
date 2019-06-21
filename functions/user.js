// Check for token expiration (substract date) <---
const tokenExpired = tokenCreation => {
  const currentDate = new Date();
  const tokenAge = Math.abs(currentDate - tokenCreation) / (1000 * 60 * 60);
  if (tokenAge >= 24) {
    return true;
  }
  return false;
};

module.exports = { tokenExpired };
