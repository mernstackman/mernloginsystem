import { getCurrentUser } from "./../frontend/apis/user-api";

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

//Get current user
/* const renderCurrentUser = (user_id, loginInfo) => {
  return new Promise((resolve, reject) => {
    if (!loginInfo) reject(false);
    getCurrentUser({ _id: user_id }, { t: loginInfo.token })
      .lean()
      .select("-password_hash -salt")
      .then(result => {
        if (result.error) {
          reject(result.error);
        }
        resolve(result);
      });
  });
};
 */
module.exports = {
  isFormValid
};
