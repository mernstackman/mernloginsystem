import React, { Component } from "react";
import auths from "./../../auth/user-auth";
import { Link } from "react-router-dom";
import hasher from "./../../../functions/hasher";

class Verify extends Component {
  constructor(props) {
    super(props);

    let emailToken = "",
      useParam = false,
      loading = false,
      hideRequest = false;

    if (props.match.params.findbyparam) {
      // if this present/ !undefined
      emailToken = props.match.params.findbyparam;
      useParam = true;
      loading = true;
      hideRequest = true;
    }

    this.state = {
      emailToken,
      useParam,
      message: "",
      error: false,
      loading,
      email: "",
      hideRequest,
      wait: false
    };
    this.match = props.match;
  }

  verifyEmail = () => {
    const data = this.state.emailToken ? { emailToken: this.state.emailToken } : "";
    console.log(this.props.location.state);
    if (!this.props.location.state && this.state.emailToken != "") {
      auths.getEmail({ emailToken: this.state.emailToken }).then(response => {
        if (response.email) {
          this.setState({ email: response.email });
        }
        // console.log(response);
      });
    }

    if (!data) {
      return this.setState({
        message: "No valid data is supplied!",
        error: true,
        loading: false,
        hideRequest: false
      });
    }
    // console.log("hasMadeReq", this.state.hasMadeReq);

    auths.verify(data).then(response => {
      console.log(response);
      console.log(this.state.message);

      let hideRequest = true;

      if (response.error && !response.error.includes("already verified.")) {
        hideRequest = false;
      }

      if (response.error) {
        console.log("XXX", response);
        return this.setState({
          message: response.error,
          error: true,
          hideRequest,
          loading: false
        });
      }
      if (response.success) {
        console.log(">>>", response);
        return this.setState({
          message: response.success,
          error: false,
          hideRequest,
          loading: false
        });
      }
    });
  };

  componentDidMount = () => {
    /*     if (this.match.params.findbyparam) {
      // if this present/ !undefined
      this.setState({
        emailToken: this.match.params.findbyparam,
        useParam: true,
        loading: true,
        hideRequest: true
      });
    } */

    let { emailToken, useParam, message } = this.state;
    if (emailToken != "" && useParam == true && message == "") {
      console.log(message);
      this.verifyEmail();
    }
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  requestNewCode = e => {
    e.preventDefault();
    if (!this.state.email && !this.props.location.state.email) {
      return this.setState({ message: "Email address required!", error: true, loading: false });
    }
    const { email } = this.state.email ? this.state : this.props.location.state;
    // Create new email token using different salt
    const mailSalt = hasher.createSalt();
    const mailToken = hasher.createHash(email, mailSalt);
    const tokenCreation = new Date();
    const data = { email, mailToken };

    this.setState({ hideRequest: true, loading: true });

    // Update the database record
    auths.updateMailToken({ email, mailToken, mailSalt, tokenCreation }).then(response => {
      console.log(response);
      if (response.verified) {
        return this.setState({ message: response.verified, loading: false });
      }
      if (response.error) {
        return this.setState({ message: response.error, hideRequest: false, loading: false });
      }
      // if Success
      if (response.success) {
        console.log("Before send email");

        // Send to the user's email
        auths.sendTheEmail(data).then(res => {
          if (!res) {
            return this.setState({
              message: "Something went wrong.. Please contact us!",
              loading: false
            });
          }

          const { accepted, rejected } = res.response;
          console.log(accepted[1], accepted.length, rejected);
          if (accepted.length == 1) {
            return this.setState({
              message:
                "Email sent! Please check your email's inbox or spam folder for the new verification link!",
              loading: false
            });
          }
          if (rejected.length == 1) {
            return this.setState({
              message: "Something went wrong.. Please contact us!",
              loading: false
            });
          }
        });
        console.log("after send email");

        // Tell user to wait for 10 minutes before the next request
        setTimeout(() => {
          this.setState({ hideRequest: false, wait: false });
        }, 1000 * 60 * 0.25);
        return this.setState({
          message: "Please wait while we are sending new verification email!",
          wait: true,
          loading: true
        });
      }
    });

    // Hide link - Wait 10 minutes before another request can be made
    console.log("Hide link for 25 seconds");
  };

  handleSubmit = e => {
    if (!this.state.useParam) e.preventDefault();
    this.setState({ loading: true });
    this.verifyEmail();
  };

  render() {
    if (this.state.emailToken) console.log(this.state.emailToken, "X");

    const { useParam, message, loading, error, hideRequest } = this.state;

    let email = "";
    if (this.props.location.state) {
      email = this.props.location.state.email;
    }
    // console.log(this.state);
    return (
      <div>
        {loading && "progress indicator "}
        {message != "" && message}
        {!useParam && (
          <div>
            Please check your email for your verification token and enter it in the following field!
            <form onSubmit={this.handleSubmit} noValidate>
              <label htmlFor="emailToken">Email Token</label>
              <br />
              <input type="text" name="emailToken" id="emailToken" onChange={this.handleChange} />
              <br />
              <br />
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}

        {this.state.wait && (
          <div>
            {/* Make this a countdown timer someday.. */}
            Please wait for 25 seconds before making the next request!
          </div>
        )}

        {(email || this.state.email) && !hideRequest && (
          <div>
            <Link to="" onClick={this.requestNewCode}>
              Request new verification code
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default Verify;
