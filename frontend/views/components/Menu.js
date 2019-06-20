import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import auth from "./../../auth/auth-helper";
import Notification from "./Notification";

const Menu = props => {
  let user_id = "";
  if (auth.isLoggedIn().loggedIn_user) {
    user_id = auth.isLoggedIn().loggedIn_user._id; // Get it from sessionStorage
  }

  return (
    <nav id="main_nav">
      <NavLink to="/">Home</NavLink> | <NavLink to="/about">About</NavLink> |{" "}
      <NavLink to="/contact">Contact</NavLink> | <NavLink to="/members">Members</NavLink> |{" "}
      {!auth.isLoggedIn() && (
        <span>
          <NavLink to="/register">Sign Up</NavLink> |
          <NavLink to={{ pathname: "/signin", state: location.pathname }}>Sign In</NavLink>
        </span>
      )}
      {auth.isLoggedIn() && (
        <span>
          <NavLink to={"/profile/" + user_id}>My Profile</NavLink> |{" "}
          <button
            onClick={() => {
              auth.signOut(() => {
                return props.history.push("/signout");
              });
            }}
          >
            Sign Out
          </button>
        </span>
      )}
    </nav>
  );
};

export default withRouter(Menu);
