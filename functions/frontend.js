const isFormValid = state => {
  const { specError, username, email, password, password_confirm } = { ...state };
  let valid = true;
  Object.values(specError).forEach(val => {
    Object.values(val).forEach(v => {
      v.length > 0 && (valid = false);
    });
    // console.log(val);
  });

  const fields = { username, email, password, password_confirm };
  Object.values(fields).forEach(val => {
    val == "" && (valid = false);
  });
  // console.log(valid);
  return valid;
};

module.exports = {
  isFormValid
};
