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

export { signin, signout };
