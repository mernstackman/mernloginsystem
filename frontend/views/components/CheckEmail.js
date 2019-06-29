import React, { Component } from "react";

class CheckEmail extends Component {
  render() {
    return (
      <div>
        <h4>Please enter your email!</h4>
        <form onSubmit={this.props.onSubmit} noValidate>
          <label htmlFor="email">Email: </label>
          <input type="text" name="email" id="email" onChange={this.props.onChange} />{" "}
          <input type="submit" value="Check" />
        </form>
      </div>
    );
  }
}

export default CheckEmail;
