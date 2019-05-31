import React, { Component } from "react";
import auths from "./../../auth/user-auth";

class Verify extends Component {
  constructor({ match }) {
    super();
    this.state = {};
    this.match = match;
  }

  componentWillReceiveProps = props => {
    console.log(props.match.params.emailtoken); // if this present/ !undefined
    auths.verify({ emailToken: props.match.params.emailtoken }); // do this
    // else execute it on form submission
  };
  componentDidMount = () => {
    console.log(this.match.params.emailtoken); // if this present/ !undefined
    auths.verify({ emailToken: this.match.params.emailtoken }); // do this
    // else execute it on form submission
  };

  render() {
    return <div>Verify</div>;
  }
}

export default Verify;
