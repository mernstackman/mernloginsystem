import React, { Component } from "react";
import { signup, checkAvailability } from "./../../apis/user-api";
import loadingGIF from "./../../img/loading.gif";
import hasher from "./../../../functions/hasher";
import { isFormValid } from "./../../../functions/frontend";
import { emailRegex, passRegex, userRegex } from "../../../config";
import auths from "./../../auth/user-auth";
/* 
This script is not yet completed. There are several features that needs to be added and bugs that needs to be fixed.
*/

class SignUp extends Component {
  componentDidMount() {
    document.title = this.props.title;
  }

  state = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    error: "",
    message: "",
    emailSent: "",
    loading: false,
    canSubmit: false,
    loadingUsername: false,
    loadingEmail: false,
    focusEmail: false,
    focusUsername: false,
    // sendingEmail: false,
    specError: {
      fullname: { long: "" },
      username: { long: "", existed: "", spechar: "" },
      email: { matched: "", existed: "" },
      password: { contains: "", matched: "" },
      password_confirm: { contains: "", matched: "" }
    }
  };

  /*   componentDidUpdate(prevProps, prevState) {
    console.log(this.state.username, prevState.username);
  } */

  handleChange = e => {
    const specErrorCopy = { ...this.state.specError };
    const { name, value } = e.target;
    let data;

    let changing = "";
    // Validate here
    switch (name) {
      case "fullname":
        specErrorCopy.fullname.long =
          value.length > 100 || value.length < 3
            ? "Full name should be between 3 to 100 characters long."
            : "";
        break;
      case "username":
        //-> show loader
        this.setState({ focusUsername: true });
        specErrorCopy.username.long =
          value.length > 20 || value.length < 3
            ? "Username should be between 3 to 20 characters long."
            : "";
        specErrorCopy.username.spechar = userRegex.test(value)
          ? "Username cannot contain space or restricted special characters!"
          : "";
        // compare value with the available record using ...?
        if (value != "") {
          this.setState({ loadingUsername: true });
          data = { username: value };
          checkAvailability(data).then(response => {
            specErrorCopy.username.existed = response.message;
            this.setState({ specError: specErrorCopy, loadingUsername: false });
            // console.log(response.message);
            //-> hide loader
          });
        }
        break;
      case "email":
        this.setState({ focusEmail: true });
        specErrorCopy.email.matched = emailRegex.test(value) ? "" : "Please enter valid email!";

        if (value != "") {
          this.setState({ loadingEmail: true });
          data = { email: value };
          checkAvailability(data).then(response => {
            specErrorCopy.email.existed = response.message;
            this.setState({ specError: specErrorCopy, loadingEmail: false });
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
    // console.log(canSubmit);
    this.setState({ specError: specErrorCopy, [name]: value, canSubmit });
  };

  handleBlur = e => {
    if (e.target.name == "username") {
      this.setState({ focusUsername: !this.state.focusUsername });
    }
    if (e.target.name == "email") {
      this.setState({ focusEmail: !this.state.focusEmail });
    }
  };
  handleFocus = e => {
    if (e.target.name == "username") {
      this.setState({ focusUsername: !this.state.focusUsername });
    }
    if (e.target.name == "email") {
      this.setState({ focusEmail: !this.state.focusEmail });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ canSubmit: false });
    // Check if there are error before submitting. Something like check if there are error message under input field.
    const { fullname, username, email, password, password_confirm } = { ...this.state };

    const mailSalt = hasher.createSalt();
    const mailToken = hasher.createHash(email, mailSalt);
    const tokenCreation = new Date();
    const data = {
      fullname,
      username,
      email,
      password,
      password_confirm,
      mailSalt,
      mailToken,
      tokenCreation
    };
    // isFormValid(this.state);
    // console.log(data);
    signup(data).then(response => {
      // DISPLAY MESSAGE : --loadingGIF animation-- Please Wait: saving your data to database
      this.setState({ message: "saving your data to database", loading: true });
      console.log(response);
      if (response.error) {
        // console.log(response.error);
        return this.setState({
          error: "Something went wrong! Please re-check the info you supplied!"
        });
      }
      this.setState({ error: "" });

      auths.sendTheEmail(data).then(res => {
        // DISPLAY MESSAGE : --loadingGIF animation-- Please Wait: sending confirmation email
        this.setState({ message: "sending confirmation email", loading: true });
        if (!res) {
          // DISPLAY ERROR MESSAGE and hide loadingGIF message
          return this.setState({
            error: "Something went wrong.. Please contact us!",
            loading: false
          });
        }

        const { accepted, rejected } = res.response;
        if (accepted.length == 1) {
          // DISPLAY MESSAGE :
          // Email sent! Please check your inbox or spam folder for verification message.
          // --loadingGIF animation-- Please Wait: redirecting you to the email verification page
          this.setState({
            message: "redirecting you to the email verification page",
            loading: true,
            emailSent:
              "Email sent! Please check your inbox or spam folder for verification message."
          });
          return setTimeout(
            () => this.props.history.push("/email", { email, id: response._id }),
            5000
          );
        }

        if (rejected.length == 1) {
          // DISPLAY ERROR MESSAGE and hide loadingGIF message
          return this.setState({ error: "Something went wrong.. Please contact us!" });
        }
      });
    });
  };

  // Validate username
  usernameValid = input => {
    const { username } = this.state.specError;
    input = typeof input === "undefined" ? false : true;
    if (this.state.loadingUsername) {
      return;
    }
    if (
      username.long.length <= 0 &&
      username.existed.length <= 0 &&
      username.spechar.length <= 0 &&
      this.state.username.length > 0
    ) {
      return input ? true : "check";
    }
    if (username.long.length > 0 || username.existed.length > 0 || username.spechar.length > 0) {
      return input ? false : "x";
    }
  };

  // Validate email
  emailValid = input => {
    input = typeof input === "undefined" ? false : true;
    const { email } = this.state.specError;
    if (this.state.loadingEmail) {
      return;
    }
    if (email.matched.length <= 0 && email.existed.length <= 0 && this.state.email.length > 0) {
      return input ? true : "check";
    }
    if (email.matched.length > 0 || email.existed.length > 0) {
      return input ? false : "x";
    }
  };

  render() {
    const { fullname, username, email, password, password_confirm } = this.state.specError;
    const {
      loading,
      message,
      emailSent,
      error,
      loadingUsername,
      loadingEmail,
      focusEmail,
      focusUsername,
      canSubmit
    } = this.state;
    // console.log(username.existed.length);
    return (
      <div>
        {error && <p>{error.toString()}</p>}
        {emailSent && <div>{emailSent}</div>}
        {loading && message != "" && (
          <div>
            <img src={loadingGIF} /> Please Wait: {message}
          </div>
        )}

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
            {fullname.long.length > 0 && <span>{fullname.long}</span>}
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
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              className={
                this.usernameValid(true) ? "green" : this.usernameValid(true) == false ? "red" : ""
              }
            />{" "}
            {loadingUsername && focusUsername && <img src={loadingGIF} />}
            {this.usernameValid()}
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
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              className={
                this.emailValid(true) ? "green" : this.emailValid(true) == false ? "red" : ""
              }
              noValidate
            />{" "}
            {loadingEmail && focusEmail && <img src={loadingGIF} />}
            {this.emailValid()}
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
          <input type="submit" value="Submit" disabled={!canSubmit} />
        </form>
      </div>
    );
  }
}

export default SignUp;
