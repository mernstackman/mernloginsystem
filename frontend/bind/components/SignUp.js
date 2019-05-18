import React, { Component } from "react";
import { signup, checkAvailability } from "./../../apis/user-api";
/* 
  This script is not yet completed. There several features that need to be added.
*/

/* const errMsg = {
  fullname: { long: "Full name should be between 3 to 100 characters long." },
  username: { long: "Username should be between 3 to 20 characters long.", exist: "" },
  email: { match: "" },
  password: { long: "", contains: "", match: "" },
  password_confirm: { long: "", contains: "", match: "" }
}; */

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
      fullname: { long: "" },
      username: { long: "", existed: "", spechar: "" },
      email: { matched: "", existed: "" },
      password: { contains: "", matched: "" },
      password_confirm: { contains: "", matched: "" }
    },
    globalError: false
  };

  handleError = () => {};

  handleChange = e => {
    const { name, value } = e.target;
    var specErrorCopy = { ...this.state.specError };
    const mailRegex = /.+\@.+\..+/;
    const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
    const userRegex = /[$&+,:;=\\\\?@#|/\'\"\`\~<>.^*()%!-\s]/;
    let data;

    let message = "";
    // Validate here
    switch (name) {
      case "fullname":
        specErrorCopy.fullname.long =
          value.length > 100 || value.length < 3
            ? "Full name should be between 3 to 100 characters long."
            : "";
        console.log(specErrorCopy.fullname.long);
        break;
      case "username":
        specErrorCopy.username.long =
          value.length > 20 || value.length < 3
            ? "Username should be between 3 to 20 characters long."
            : "";
        specErrorCopy.username.spechar = userRegex.test(value)
          ? "Username cannot contain space or restricted special characters!"
          : "";
        // compare value with the available record using ...?
        data = { username: value };
        checkAvailability(data).then(response => {
          specErrorCopy.username.existed = response.message;
          this.setState({ specError: specErrorCopy });
          console.log(response.message);
        });
        break;
      case "email":
        specErrorCopy.email.matched = mailRegex.test(value) ? "" : "Please enter valid email!";

        data = { email: value };
        checkAvailability(data).then(response => {
          specErrorCopy.email.existed = response.message;
          this.setState({ specError: specErrorCopy });
        });
        break;
      case "password":
        specErrorCopy.password.contains = passRegex.test(value)
          ? ""
          : "Password should at least 6 characters long, contains 1 lowercase, 1 uppercase and 1 special character!";

        specErrorCopy.password.matched =
          value == this.state.password_confirm && this.state.password_confirm != ""
            ? ""
            : "Password not match!";

        break;
      case "password_confirm":
        specErrorCopy.password_confirm.contains = passRegex.test(value)
          ? ""
          : "Password should at least 6 characters long, contains 1 lowercase, 1 uppercase and 1 special character!";

        specErrorCopy.password_confirm.matched =
          value == this.state.password && this.state.password != "" ? "" : "Password not match!";
        break;
      default:
        break;
    }

    this.setState({ specError: specErrorCopy, [name]: value });
    /*     console.log(value);
    console.log(this.state.specError.fullname.long); */
    console.log(specErrorCopy.username.spechar);
    console.log(specErrorCopy.username.existed);
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
    const { fullname, username, email, password, password_confirm } = this.state.specError;
    console.log(username.existed.length);
    return (
      <div>
        {this.state.error && <p>{this.state.error.toString()}</p>}
        <form onSubmit={this.createNewMember} noValidate>
          <div>
            <label htmlFor="fullname">Name:</label> <br />
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Full name"
              onChange={this.handleChange}
            />{" "}
            <br />
            {fullname.long.length > 0 && <span>{fullname.long}</span>}
          </div>
          <div>
            <label htmlFor="username">Username:</label> <br />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              onChange={this.handleChange}
            />{" "}
            {username.long.length > 0 && (
              <span>
                <br />
                {username.long}
              </span>
            )}
            {username.existed.length > 0 && (
              <span>
                <br /> {username.existed}
              </span>
            )}
            {username.spechar.length > 0 && (
              <span>
                <br /> {username.spechar}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="email">Email:</label> <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={this.handleChange}
              noValidate
            />{" "}
          </div>

          <div>
            <label htmlFor="password">Password:</label> <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={this.handleChange}
            />{" "}
          </div>

          <div>
            <label htmlFor="password_confirm">Confirm password:</label> <br />
            <input
              type="password"
              name="password_confirm"
              id="password_confirm"
              placeholder="Confirm password"
              onChange={this.handleChange}
            />
          </div>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default SignUp;
