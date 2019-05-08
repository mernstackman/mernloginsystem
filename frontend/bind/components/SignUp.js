import React, { Component } from "react";
import { signup } from "./../../apis/user-api";

/* 
  This script is not yet completed. There several features that need to be added.
*/

class SignUp extends Component {
  state = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    open: false,
    error: ""
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  createNewMember = e => {
    e.preventDefault();
    const data = {
      fullname: this.state.fullname,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm
    };

    signup(data).then(response => {
      if (response.error) {
        console.log(response.error);
        return this.setState({
          error: "Something went wrong! Please re-check the info you supplied!"
        });
      }
      this.setState({ error: "", open: true });
    });
  };

  render() {
    return (
      <div>
        {this.state.error && <p>{this.state.error.toString()}</p>}
        <form onSubmit={this.createNewMember} noValidate>
          <label htmlFor="fullname">Name:</label> <br />
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Full name"
            onChange={this.handleChange}
          />{" "}
          <br />
          <br />
          <label htmlFor="username">Username:</label> <br />
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={this.handleChange}
          />{" "}
          <br />
          <br />
          <label htmlFor="email">Email:</label> <br />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={this.handleChange}
            noValidate
          />{" "}
          <br />
          <br />
          <label htmlFor="password">Password:</label> <br />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={this.handleChange}
          />{" "}
          <br />
          <br />
          <label htmlFor="password_confirm">Confirm password:</label> <br />
          <input
            type="password"
            name="password_confirm"
            id="password_confirm"
            placeholder="Confirm password"
            onChange={this.handleChange}
          />
          <br />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default SignUp;
