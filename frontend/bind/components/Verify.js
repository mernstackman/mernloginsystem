import React, { Component } from "react";
import auths from "./../../auth/user-auth";
import { Link } from "react-router-dom";

class Verify extends Component {
  constructor({ match }) {
    super();
    this.state = {
      emailToken: "",
      useParam: false,
      message: "",
      error: false,
      loading: false,
      email: ""
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
    // Get email from history or using supplied token
    let email = "";
    if (this.props.location.state) {
      email = this.props.location.state.email;
    }
    if (!this.props.location.state && this.state.emailToken != "") {
      this.state.emailToken;
      auths.getEmail({ emailToken: this.state.emailToken }).then(response => {
        if (response.email) {
          email = response.email;
        }
      });
    }
    if (email) {
      return console.log("email exist!");
      this.setState({ email });
    }
    // Create new email token using different salt
    // Update the database record
    // Send to the user's email
    // Hide link
    console.log("Test");
  };

  verifyEmail = () => {
    const data = { emailToken: this.state.emailToken };
    return auths.verify(data).then(response => {
      if (response.error && !response.norecord) {
        this.setState({ message: response.error, error: true, loading: false });
      } else if (response.success) {
        this.setState({ message: response.success, error: false, loading: false });
      } else if (response.norecord) {
        this.setState({ message: response.error, error: true, loading: false });
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
    const { emailToken, useParam, message, loading, error, norecord } = { ...this.state };
    emailToken != "" && useParam && message == "" && this.verifyEmail();
    let email = "";
    if (this.props.location.state) {
      email = this.props.location.state.email;
    }
    if (email) console.log(email);
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
        {(message.includes("expired!") || email) && (
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
