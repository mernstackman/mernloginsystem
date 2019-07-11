import React, { Component, Fragment } from "react";
import auths from "./../../auth/user-auth";
import hasher from "./../../../functions/hasher";
import { tokenExpired } from "./../../../functions/user";
import eclipseGIF from "./../../img/eclipse.gif";
import { passRegex } from "../../../config";
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
      mailData: {},
      password: "",
      passwordConf: "",
      passwordDb: "",
      saltDb: ""
    };
  }

  componentDidMount() {
    document.title = this.props.title;
    // Determine which form to display
    if (this.state.urlToken) {
      console.log("Token in url");
      auths.checkByValue({ value: this.state.urlToken + this.state.query }).then(response => {
        console.log(response);
        if (response.error) {
          return this.setState({
            tokenValid: false,
            checkEmail: true,
            error: "Error: Token is not valid!"
          });
        }

        // CHECKING IF TOKEN IS VALID AND OR EXPIRED REQUIRE PARSING JSON STRING.
        if (!response.pwResetToken) {
          return this.setState({
            tokenValid: false,
            checkEmail: true,
            error: "Token not found: Token is not valid!"
          });
        }

        const { mailSalt, resetToken, tokenCreation } = JSON.parse(response.pwResetToken);
        if (resetToken != this.state.urlToken || tokenExpired(new Date(tokenCreation))) {
          console.log(resetToken, this.state.urlToken, tokenExpired(new Date(tokenCreation)));
          return this.setState({
            tokenValid: false,
            checkEmail: true,
            error: "Token is not valid!"
          });
        }
        console.log(response.email);
        this.setState({ tokenValid: true, checkEmail: false, email: response.email });
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
      const data = { email, update: { pwResetToken } };
      auths.updateByEmail(data).then(response => {
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

  handleChange = e => {
    const { name, value } = e.target;
    console.log(value);
    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.checkEmail == false) {
      this.setState({
        loading: "Validating your new password!"
      });
      // Check password if meet requirements
      if (!passRegex.test(this.state.password)) {
        return this.setState({
          error:
            "Password should at least 6 characters long, contains 1 lowercase, 1 uppercase and 1 special character!",
          loading: ""
        });
      }

      // Compare password with the confirmation
      if (this.state.password != this.state.passwordConf) {
        return this.setState({ error: "Password don't match the confirmation!", loading: "" });
      }

      console.log(this.state.password);
      // Compare password with the saved one
      // - get password_hash and salt from database using email and checkByValue method
      return auths
        .checkByValue({ value: this.state.email + "/?email=''&password=1" })
        .then(response => {
          if (!response || response.error) {
            return this.setState({
              error: "Unable to connect to the server.",
              loading: ""
            });
          }
          // - hash the supplied password using salt from database
          // - compare the hashed supplied password with the password_hash - if equal, return error.
          const pwhashed = hasher.createHash(this.state.password, response.salt);
          if (pwhashed == response.password_hash) {
            return this.setState({
              error: "You have found your old password!",
              loading: ""
            });
          }

          // Save password to database.
          this.setState({
            loading: "Changing your password with the new one!"
          });
          const salt = hasher.createSalt();
          const password_hash = hasher.createHash(this.state.password, salt);
          const update = { salt, password_hash };
          const data = { email: this.state.email, update };
          return auths.updateByEmail(data).then(resp => {
            if (resp.error) {
              return this.setState({
                error: resp.error
              });
            }
            console.log(resp.success);
            return this.setState({
              success: resp.success,
              error: "",
              loading: ""
            });
          });
        });
    }

    // check email in record.
    this.setState({ loading: "Please wait while we are checking that email!" });
    auths.checkByValue({ value: this.state.email + "/?email" }).then(response => {
      console.log(response);
      if (response.error) {
        return this.setState({ success: "", error: response.error, loading: "" });
      }
      this.setState({ emailExist: true, loading: "Creating password reset link!" });
    });
  };

  render() {
    const { error, success, tokenValid, checkEmail, loading } = this.state;
    console.log(success);
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
        {loading && (
          <div className="loading-message">
            <img src={eclipseGIF} /> {loading}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={this.handleSubmit} noValidate>
          <div>
            <label htmlFor="new-password">New Password:</label>
            <br />
            <input onChange={this.handleChange} type="password" name="password" id="new-password" />
          </div>

          <div>
            <label htmlFor="retype-password">Retype Password:</label>
            <br />
            <input
              onChange={this.handleChange}
              type="password"
              name="passwordConf"
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
