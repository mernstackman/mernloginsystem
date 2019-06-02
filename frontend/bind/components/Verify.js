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
      error: false,
      loading: false
    };
    this.match = match;
  }
  componentWillReceiveProps = props => {
    if (props.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: props.match.params.emailtoken, useParam: true, loading: true });
    }
    // auths.verify({ emailToken: props.match.params.emailtoken }); // do this
    // else execute it on form submission
  };
  componentDidMount = () => {
    if (this.match.params.emailtoken) {
      // if this present/ !undefined
      this.setState({ emailToken: this.match.params.emailtoken, useParam: true, loading: true });
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

  verifyEmail = () => {
    const data = { emailToken: this.state.emailToken };
    return auths.verify(data).then(response => {
      if (response.error) {
        this.setState({ message: response.error, error: true, loading: false });
      } else if (response.success) {
        this.setState({ message: response.success, error: false, loading: false });
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
    const { emailToken, useParam, message, loading, error } = { ...this.state };
    emailToken != "" && useParam && message == "" && this.verifyEmail();

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
      </div>
    );
  }
}

export default Verify;
