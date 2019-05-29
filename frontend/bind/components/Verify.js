import React, { Component } from "react";
import auths from "./../../auth/user-auth";

class Verify extends Component {
  constructor({ match }) {
    super();
    this.state = {};
    this.match = match;
  }

  componentWillReceiveProps = props => {
    console.log(props.match.params.emailtoken);
    auths.verify({ emailToken: props.match.params.emailtoken });
  };
  componentDidMount = () => {
    console.log(this.match.params.emailtoken);
    auths.verify({ emailToken: this.match.params.emailtoken });
  };

  render() {
    return <div />;
  }
}

export default Verify;
