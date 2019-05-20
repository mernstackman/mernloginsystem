import React, { Component } from "react";
import { signup, checkAvailability } from "./../../apis/user-api";
import loading from "./../../img/loading.gif";
/* 
This script is not yet completed. There several features that need to be added.
*/
const isFormValid = state => {
  const { specError, username, email, password, password_confirm } = { ...state };
  let valid = true;
  Object.values(specError).forEach(val => {
    Object.values(val).forEach(v => {
      v.length > 0 && (valid = false);
    });
    // console.log(val);
  });

  const fields = { username, email, password, password_confirm };
  Object.values(fields).forEach(val => {
    val == "" && (valid = false);
  });
  console.log(valid);
  return valid;
};

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const mailRegex = /.+\@.+\..+/;
const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
const userRegex = /[$&+,:;=\\\\?@#|/\'\"\`\~<>.^*()%!-\s]/;

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
    canSubmit: false,
    loading: false,
    changing: ""
  };

  handleChange = e => {
    const specErrorCopy = { ...this.state.specError };
    const { name, value } = e.target;
    let data;

    let changing = "";
    // Validate here
    switch (name) {
      /*       case "fullname":
        specErrorCopy.fullname.long =
          value.length > 100 || value.length < 3
            ? "Full name should be between 3 to 100 characters long."
            : "";
        console.log(specErrorCopy.fullname.long);
        break; */
      case "username":
        //-> show loader
        changing = "username";
        this.setState({ changing });
        specErrorCopy.username.long =
          value.length > 20 || value.length < 3
            ? "Username should be between 3 to 20 characters long."
            : "";
        specErrorCopy.username.spechar = userRegex.test(value)
          ? "Username cannot contain space or restricted special characters!"
          : "";
        // compare value with the available record using ...?
        if (value != "") {
          this.setState({ loading: true });

          data = { username: value };
          checkAvailability(data).then(response => {
            specErrorCopy.username.existed = response.message;
            this.setState({ specError: specErrorCopy, loading: false });
            console.log(response.message);
            //-> hide loader
          });
        }
        break;
      case "email":
        changing = "email";
        this.setState({ changing });
        specErrorCopy.email.matched = emailRegex.test(value) ? "" : "Please enter valid email!";

        if (value != "") {
          this.setState({ loading: true });
          data = { email: value };
          checkAvailability(data).then(response => {
            specErrorCopy.email.existed = response.message;
            this.setState({ specError: specErrorCopy, loading: false });
          });
        }
        break;
      case "password":
        specErrorCopy.password.contains = passRegex.test(value)
          ? ""
          : "Password should at least 6 characters long, contains 1 lowercase, 1 uppercase and 1 special character!";

        specErrorCopy.password.matched =
          value != this.state.password_confirm && this.state.password_confirm != ""
            ? "Password not match the password confirmation!"
            : "";

        break;
      case "password_confirm":
        specErrorCopy.password_confirm.contains = passRegex.test(value)
          ? ""
          : "Password should at least 6 characters long, contains 1 lowercase, 1 uppercase and 1 special character!";

        specErrorCopy.password_confirm.matched =
          value != this.state.password && this.state.password != ""
            ? "Password confirmation not match the password!"
            : "";
        break;
      default:
        break;
    }
    const canSubmit = isFormValid(this.state);
    console.log(canSubmit);
    this.setState({ specError: specErrorCopy, [name]: value, canSubmit });
  };

  handleSubmit = e => {
    e.preventDefault();
    // Check if there are error before submitting. Something like check if there are error message under input field.

    const data = ({ fullname, username, email, password, password_confirm } = { ...this.state });

    // isFormValid(this.state);

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
        <form onSubmit={this.handleSubmit} noValidate>
          <div>
            <label htmlFor="fullname">Name:</label> <br />
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Full name"
              onChange={this.handleChange}
            />
            {/* fullname.long.length > 0 && <span>{fullname.long}</span> */}
          </div>
          <br />
          <div>
            <label htmlFor="username">Username:</label> <span>*</span> <br />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              onChange={this.handleChange}
            />{" "}
            {this.state.loading && this.state.changing == "username" && <img src={loading} />}
            {!this.state.loading &&
              this.state.changing == "username" &&
              username.long.length <= 0 &&
              username.existed.length <= 0 &&
              username.spechar.length <= 0 &&
              "check" /* <img src={"checkmark"} /> */}
            {((!this.state.loading &&
              this.state.changing == "username" &&
              username.long.length > 0) ||
              username.existed.length > 0 ||
              username.spechar.length > 0) &&
              "x" /* <img src={"x"} /> */}
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
          <br />
          <div>
            <label htmlFor="email">Email:</label> <span>*</span>
            <br />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={this.handleChange}
              noValidate
            />{" "}
            {!this.state.loading &&
              this.state.changing == "email" &&
              email.matched.length <= 0 &&
              email.existed.length <= 0 &&
              "check" /* <img src={"checkmark"} /> */}
            {!this.state.loading &&
              this.state.changing == "email" &&
              (email.matched.length > 0 || email.existed.length > 0) &&
              "x" /* <img src={"x"} /> */}
            {this.state.loading && this.state.changing == "email" && <img src={loading} />}
            {email.matched.length > 0 && (
              <span>
                <br /> {email.matched}
              </span>
            )}
            {email.existed.length > 0 && (
              <span>
                <br /> {email.existed}
              </span>
            )}
          </div>
          <br />
          <div>
            <label htmlFor="password">Password:</label> <span>*</span>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            {password.contains.length > 0 && (
              <span>
                <br /> {password.contains}
              </span>
            )}
            {password.matched.length > 0 && (
              <span>
                <br /> {password.matched}
              </span>
            )}
          </div>
          <br />

          <div>
            <label htmlFor="password_confirm">Confirm password:</label> <span>*</span>
            <br />
            <input
              type="password"
              name="password_confirm"
              id="password_confirm"
              placeholder="Confirm password"
              onChange={this.handleChange}
            />
            {password_confirm.contains.length > 0 && (
              <span>
                <br /> {password_confirm.contains}
              </span>
            )}
            {password_confirm.matched.length > 0 && (
              <span>
                <br /> {password_confirm.matched}
              </span>
            )}
          </div>
          <br />
          <input type="submit" value="Submit" disabled={!this.state.canSubmit} />
        </form>
      </div>
    );
  }
}

export default SignUp;
