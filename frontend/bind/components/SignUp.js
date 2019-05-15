import React, { Component } from "react";
import { signup, checkAvailability } from "./../../apis/user-api";
/* 
  This script is not yet completed. There several features that need to be added.
*/

const errMsg = {
  fullname: { length: "Full name should be between 3 to 100 characters long." },
  username: { length: "Username should be between 3 to 20 characters long.", exist: "" },
  email: { match: "" },
  password: { length: "", contains: "", match: "" },
  password_confirm: { length: "", contains: "", match: "" }
};

class SignUp extends Component {
  state = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    open: false,
    error: "",
    specError: {
      fullname: { long: false },
      username: { long: false, existed: false },
      email: { matched: false },
      password: { long: false, containing: false, matched: false },
      password_confirm: { long: false, containing: false, matched: false }
    },
    globalError: false
  };

  handleError = () => {};

  handleChange = e => {
    const { name, value } = e.target;
    const specErrorCopy = { ...this.state.specError };

    // Validate here
    switch (name) {
      case "fullname":
        specErrorCopy.fullname.long = value.length <= 100 && value.length >= 3 ? false : true;
        break;
      case "username":
        specErrorCopy.username.long = value.length <= 20 && value.length >= 3 ? false : true;
        // compare value with the available record using ...?
        const data = { username: value };
        checkAvailability(data).then(response => {
          specErrorCopy.username.existed = response.inUse;
          console.log(specErrorCopy.username.existed, response.message);
        });
        break;
      case "email":
        break;
      case "password":
        break;
      case "password_confirm":
        break;
      default:
        break;
    }

    this.setState({ specError: specErrorCopy, [name]: value });
    // console.log(errList);
    console.log(value);
    // console.log(this.state.fullname);
    console.log(this.state.specError.fullname.long);
  };

  createNewMember = e => {
    e.preventDefault();
    // Check if there are error before submitting. Something check if there are error message under input field.

    const data = ({ fullname, username, email, password, password_confirm } = { ...this.state });

    console.log(this.state);

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
          {this.state.specError.fullname.long && "Error"}
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
