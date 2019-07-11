import React, { Component } from "react";

export class Contact extends Component {
  componentDidMount() {
    document.title = this.props.title;
  }

  render() {
    return <div>I am contact page!</div>;
  }
}

export default Contact;
