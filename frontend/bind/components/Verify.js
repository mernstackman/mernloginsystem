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
      id: "",
      hideRequest: false,
      wait: false
    };
    this.match = match;
  }
  componentWillReceiveProps = props => {
    if (props.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: props.match.params.emailtoken, useParam: true, loading: true });
    }
  };
  componentDidMount = () => {
    if (this.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: this.match.params.emailtoken, useParam: true, loading: true });
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
    const { id } = this.state.id ? this.state : this.props.location.state;
    // Create new email token using different salt
    const mailSalt = hasher.createSalt();
    const mailToken = hasher.createHash(email, mailSalt);
    const tokenCreation = new Date();

    this.setState({ hideRequest: true });

    // Update the database record
    auths.updateMailToken({ id, email, mailToken, mailSalt, tokenCreation }).then(response => {
      console.log(response);
      if (response.verified) {
        return this.setState({ message: response.verified });
      }
      if (response.error) {
        return this.setState({ message: response.error, hideRequest: false });
      }
      // if Success
      if (response.success) {
        // Send to the user's email

        // Tell user to wait for 10 minutes before the next request
        setTimeout(() => {
          this.setState({ hideRequest: false, wait: false });
        }, 1000 * 60 * /* 10 */ 0.1);
        return this.setState({ message: response.success, wait: true });
      }
    });

    // Hide link - Wait 10 minutes before another request can be made
    console.log("Hide link for 10 minutes");
  };

  verifyEmail = () => {
    const data = this.state.emailToken ? { emailToken: this.state.emailToken } : "";

    console.log(this.props.location.state);
    if (!this.props.location.state && this.state.emailToken != "") {
      auths.getEmail({ emailToken: this.state.emailToken }).then(response => {
        if (response.email) {
          this.setState({ email: response.email, id: response._id });
        }
      });
    }

    this.setState({ error: true, loading: false, hideRequest: false });
    if (!data) {
      return this.setState({ message: "No valid data is supplied!" });
    }

    auths.verify(data).then(response => {
      console.log(response);
      /* if(response) {
} */

      if (response.error && !response.norecord) {
        return this.setState({ message: response.error });
      }
      if (response.norecord) {
        return this.setState({ message: response.error });
      }
      if (response.success) {
        return this.setState({ message: response.success, error: false, hideRequest: true });
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

    const { emailToken, useParam, message, loading, error, norecord, hideRequest } = {
      ...this.state
    };

    emailToken != "" && useParam && message == "" && this.verifyEmail();

    let email = "";
    if (this.props.location.state) {
      email = this.props.location.state.email;
    }
    console.log(this.props.location.state);
    return (
      <div>
        {loading && "progress indicator"}
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
            {/* Make this a countdown timer someday.. */}Please wait for 10 minutes before making
            the next request!
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
