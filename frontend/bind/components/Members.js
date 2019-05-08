import React, { Component } from "react";
import { list } from "./../../apis/user-api";
import { Link } from "react-router-dom";

class Members extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        return console.log(error);
      }
      return this.setState({ users: data });
    });
  }

  render() {
    console.log(this.state.users);
    return (
      <div>
        {this.state.users.map((user, index) => {
          return (
            <div key={user._id}>
              <p>
                {index + 1 + ". " + user.username}{" "}
                <Link to={"/profile/" + user._id}>
                  <button>details</button>
                </Link>
              </p>
              <hr />
            </div>
          );
        })}
      </div>
    );
  }
}

export default Members;
