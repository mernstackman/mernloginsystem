import auths from "./user-auth";

const auth = {
  isLoggedIn() {
    // if in back end
    if (typeof window === "undefined") {
      return false;
    }

    // parse string to json
    if (sessionStorage.getItem("jwt")) {
      return JSON.parse(sessionStorage.getItem("jwt"));
    }

    return false;
  },
  signOut(callback) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    callback();
    auths.signout().then(data => {
      document.cookie = "usin=; expires=Thu, 01 Jan 1970 00:00:00 UT; path=/;";
    });
  }
};

export default auth;
