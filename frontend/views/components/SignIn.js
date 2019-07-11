import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import auths from "./../../auth/user-auth";

class SignIn extends Component {
  state = {
    user: "",
    password: "",
    error: "",
    redirToPrev: false
  };
  componentDidMount() {
    document.title = this.props.title;
  }
  handleChange = e => {
    // console.log(signin);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitForm = e => {
    e.preventDefault();

    const data = {
      user: this.state.user,
      password: this.state.password
    };
    auths.signin(data).then(result => {
      console.log(result);
      if (result.Error) {
        return this.setState({ error: result.Error }); // If error happen, change this
      }

      // Store jwt to session storage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("jwt", JSON.stringify(result));
        this.setState({ redirToPrev: true });
      }
    });
  };

  render() {
    // Redirect to refering page after sign in
    let from = this.props.location.state || { pathname: "/" };
    console.log(from);
    if (from == "/signout" || from == "/register") {
      from = { pathname: "/" };
    }

    const redir = this.state.redirToPrev;
    if (redir) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <form onSubmit={this.submitForm}>
          <label htmlFor="username">User</label>
          <br />
          <input
            placeholder="email or username"
            type="text"
            name="user"
            id="username"
            onChange={this.handleChange}
          />
          <br />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" name="password" id="password" onChange={this.handleChange} />
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
        <Link to="/password/recovery">Forgot password?</Link>
      </div>
    );
  }
}

export default SignIn;
