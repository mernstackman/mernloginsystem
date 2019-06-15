import React, { Component } from "react";
import auths from "./../../auth/user-auth";
import { Link } from "react-router-dom";
import hasher from "./../../../functions/hasher";

class Verify extends Component {
  constructor({ match }) {
    super();
    this.state = {
      emailToken: "",
      useParam: false,
      message: "",
      error: false,
      loading: false,
      email: "",
      hideRequest: false,
      wait: false
    };
    this.match = match;
  }

  componentWillReceiveProps = props => {
    if (props.match.params.findbyparam) {
      // if this present/ !undefined
      this.setState({
        emailToken: props.match.params.findbyparam,
        useParam: true,
        loading: true,
        hideRequest: true
      });
    }
  };
  componentDidMount = () => {
    if (this.match.params.findbyparam) {
      // if this present/ !undefined
      this.setState({
        emailToken: this.match.params.findbyparam,
        useParam: true,
        loading: true,
        hideRequest: true
      });
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

  verifyEmail = () => {
    const data = this.state.emailToken ? { emailToken: this.state.emailToken } : "";
    console.log(this.props.location.state);
    if (!this.props.location.state && this.state.emailToken != "") {
      auths.getEmail({ emailToken: this.state.emailToken }).then(response => {
        if (response.email) {
          this.setState({ email: response.email });
        }
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

    auths.verify(data).then(response => {
      console.log(response);
      let hideRequest = true;
      if (!response.error.includes("already verified.")) {
        hideRequest = false;
      }

      if (response.error) {
        return this.setState({
          message: response.error,
          error: true,
          hideRequest,
          loading: false
        });
      }
      if (response.success) {
        return this.setState({
          message: response.success,
          error: false,
          hideRequest,
          loading: false
        });
      }
      console.log(this.state.message);
    });
  };

  handleSubmit = e => {
    if (!this.state.useParam) e.preventDefault();
    this.setState({ loading: true });
    this.verifyEmail();
  };

  render() {
    if (this.state.emailToken) console.log(this.state.emailToken, "X");

    const { emailToken, useParam, message, loading, error, hideRequest } = {
      ...this.state
    };

    emailToken != "" && useParam && message == "" && this.verifyEmail();

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
          <form onSubmit={this.handleSubmit} noValidate>
            <label htmlFor="emailToken">Email Token</label>
            <br />
            <input type="text" name="emailToken" id="emailToken" onChange={this.handleChange} />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
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
