import React, { Component } from "react";
import auths from "./../../auth/user-auth";
import { format } from "path";

const verifyEmail = emailToken => {};

class Verify extends Component {
  constructor({ match }) {
    super();
    this.state = {
      emailToken: "",
      useParam: false,
      message: "",
      error: false
    };
    this.match = match;
  }
  componentWillReceiveProps = props => {
    if (props.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: props.match.params.emailtoken, useParam: true });
    }
    // auths.verify({ emailToken: props.match.params.emailtoken }); // do this
    // else execute it on form submission
  };
  componentDidMount = () => {
    if (this.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: this.match.params.emailtoken, useParam: true });
    }
    // auths.verify({ emailToken: this.match.params.emailtoken }); // do this
    // else execute it on form submission
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    if (!this.state.useParam) e.preventDefault();

    const data = { emailToken: this.state.emailToken };
    return auths.verify(data).then(response => {
      if (response.error) {
        this.setState({ message: response.error, error: true });
      } else if (response.success) {
        this.setState({ message: response.success, error: false });
      }
      console.log(this.state.message);
    });
  };

  render() {
    const { emailToken, useParam, message } = { ...this.state };
    emailToken != "" && useParam && message == "" && this.handleSubmit();

    return (
      <div>
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
      </div>
    );
  }
}

export default Verify;
