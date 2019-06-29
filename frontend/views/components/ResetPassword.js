import React, { Component, Fragment } from "react";
import auths from "./../../auth/user-auth";
import hasher from "./../../../functions/hasher";
import eclipseGIF from "./../../img/eclipse.gif";

import CheckEmail from "./CheckEmail";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    // get referrer url

    let checkEmail = true,
      urlToken = "",
      query = "";
    // If the url has parameter
    if (props.match.params.findbyparam) {
      urlToken = props.match.params.findbyparam;
    }

    if (props.location.search) {
      query = props.location.search;
    }

    this.state = {
      urlToken,
      query,
      error: "",
      success: "",
      tokenValid: false,
      checkEmail,
      email: "",
      loading: "",
      emailExist: false,
      savingSuccess: false,
      mailData: {}
    };
  }

  componentDidMount() {
    // Determine which form to display
    if (this.state.urlToken) {
      console.log("Token in url");
      auths.checkByValue({ content: this.state.urlToken + this.state.query }).then(response => {
        console.log(response);
        // Checking if token is valid and or expired require parsing json string.
        if (response.error) {
          return this.setState({
            tokenValid: false,
            checkEmail: true,
            error: "Token is not valid!"
          });
        }
        this.setState({ tokenValid: true, checkEmail: false });
      });
    }
  }

  componentDidUpdate() {
    const { email } = this.state;
    if (this.state.emailExist == true) {
      const mailSalt = hasher.createSalt();
      const resetToken = hasher.createHash(email, mailSalt);
      const tokenCreation = new Date();
      const pwResetToken = JSON.stringify({ mailSalt, resetToken, tokenCreation });
      const data = { email, pwResetToken };
      auths.createResetToken(data).then(response => {
        if (response.error) {
          return this.setState({
            success: "",
            emailExist: false,
            savingSuccess: false,
            loading: "",
            error: response.error
          });
        }
        this.setState({
          mailData: { email, resetToken },
          savingSuccess: true,
          emailExist: false,
          loading: "Sending password reset link to your email!"
        });
      });
    }

    if (this.state.savingSuccess == true) {
      auths.sendTheEmail(this.state.mailData).then(res => {
        if (!res) {
          return this.setState({
            success: "",
            savingSuccess: false,
            loading: "",
            error: "Email cannot be sent. Please retry or contact us!"
          });
        }

        const { accepted, rejected } = res.response;
        if (rejected.length == 1) {
          return this.setState({
            success: "",
            savingSuccess: false,
            loading: "",
            error: "Email cannot be sent. Please retry or contact us!"
          });
        }

        if (accepted.length == 1) {
          this.setState({
            success: "Please check your inbox or spam folder for password reset link!",
            savingSuccess: false,
            loading: ""
          });
        }
      });
    }
  }

  displayForm = () => {};

  handleSubmit = e => {
    e.preventDefault();
    // check email in record.
    this.setState({ loading: "Please wait while we are checking that email!" });

    auths.checkByValue({ content: this.state.email }).then(response => {
      console.log(response);
      if (response.error) {
        return this.setState({ success: "", error: response.error, loading: "" });
      }
      this.setState({ emailExist: true, loading: "Creating password reset link!" });
    });
  };

  handleChange = e => {
    const { name, value } = e.target;
    console.log(value);
    this.setState({
      [name]: value
    });
  };

  render() {
    const { error, success, tokenValid, checkEmail, loading } = this.state;

    if (tokenValid == false || checkEmail == true) {
      return (
        <Fragment>
          {error && <div className="error-message">{error}</div>}
          {loading && (
            <div className="loading-message">
              <img src={eclipseGIF} /> {loading}
            </div>
          )}
          {success && <div className="success-message">{success}</div>}
          <CheckEmail onChange={this.handleChange} onSubmit={this.handleSubmit} />
        </Fragment>
      );
    }

    // If reset password token is valid, show the following form, else notify user
    return (
      <div id="reset-password">
        <h4>Please create your new password!</h4>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={this.handleSubmit} noValidate>
          <div>
            <label htmlFor="new-password">New Password:</label>
            <br />
            <input
              onChange={this.handleChange}
              type="password"
              name="newpassword"
              id="new-password"
            />
          </div>

          <div>
            <label htmlFor="retype-password">Retype Password:</label>
            <br />
            <input
              onChange={this.handleChange}
              type="password"
              name="retypepassword"
              id="retype-password"
            />
          </div>

          <input type="submit" value="Save" />
        </form>
      </div>
    );
  }
}

export default ResetPassword;
