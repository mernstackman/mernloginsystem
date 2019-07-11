import React, { Component } from "react";

class About extends Component {
  componentDidMount() {
    document.title = this.props.title;
  }

  render() {
    return <div>I am about page!</div>;
  }
}

export default About;
