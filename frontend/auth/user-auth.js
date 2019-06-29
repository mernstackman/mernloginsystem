const signin = data => {
  return fetch("/api/signin", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.log(err));
};

const signout = () => {
  return fetch("/api/signout", {
    method: "GET"
  })
    .then(response => {
      return response.json();
    })
    .catch(e => console.log(e));
};

// To be called on the front end
// Get from front end and send it to backend
const verify = data => {
  /*   console.log(data);
  if (!data) {
    return new Promise((resolve, reject) => {
      resolve({ error: "No valid data!" });
    });
  } */
  const emailToken = data.emailToken ? data.emailToken : "";
  return fetch("/email/" + emailToken, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const getEmail = data => {
  return fetch("/email/verify/" + data.content, {
    method: "GET",
    headers: {
      Accept: "text/html",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const updateMailToken = data => {
  return fetch("/email/" + data.email, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const checkByValue = data => {
  return fetch("/value/check/" + data.content, {
    method: "GET",
    headers: {
      Accept: "text/html",
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      console.log(response);
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const createResetToken = data => {
  return fetch("/password/update", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const sendTheEmail = data => {
  console.log(data);
  return fetch("/send/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      console.log(err);
    });
};

const auths = {
  signin,
  signout,
  verify,
  getEmail,
  updateMailToken,
  sendTheEmail,
  checkByValue,
  createResetToken
};
export default auths;
