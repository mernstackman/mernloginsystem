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
  return fetch("/email/verify/" + data.emailToken, {
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

const auths = { signin, signout, verify, getEmail };
export default auths;
