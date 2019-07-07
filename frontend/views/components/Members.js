import qs from "query-string";
import React, { Component } from "react";
import { list } from "./../../apis/user-api";
import { Link } from "react-router-dom";

class Members extends Component {
  constructor(props) {
    super(props);

    const query = qs.parse(props.location.search);
    const limit = query.pp || undefined;
    const skip = query.pn || null;

    this.state = {
      users: [],
      limit,
      skip,
      total: 0
    };
  }

  componentDidMount() {
    const { limit, skip } = this.state;
    const query = "?perPage=" + limit + "&pageNum=" + skip;
    console.log(query);
    list({ query }).then(data => {
      if (data.error) {
        return console.log(error);
      }
      console.log(data.skip);
      return this.setState({ total: data.total, users: data.users });
    });
  }

  render() {
    console.log(this.state.total);
    return (
      <div>
        {this.state.users.map((user, index) => {
          return (
            <div key={user._id}>
              <p>
                {(index + 1 + (parseInt(this.state.skip) - 1) * parseInt(this.state.limit) || 0) +
                  ". " +
                  user.username}{" "}
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
