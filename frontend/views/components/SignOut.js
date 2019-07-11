import React, { Component } from "react";
import { Link } from "react-router-dom";

class SignOut extends Component {
  componentDidMount() {
    document.title = this.props.title;
  }

  render() {
    return (
      <div>
        <h1>You've successfully signed out...!</h1>
        <Link to="/signin">Sign In</Link>
      </div>
    );
  }
}

export default SignOut;
