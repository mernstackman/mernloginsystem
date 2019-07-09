import qs from "query-string";
import React, { Component } from "react";
import { list } from "./../../apis/user-api";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";

class Members extends Component {
  constructor(props) {
    super(props);

    const query = qs.parse(props.location.search);
    const limit = query.pp || 10;
    const skip = query.pn || 1;

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
        return this.setState({ error: data.error });
      }
      return this.setState({ total: data.total, users: data.users });
    });
  }

  handleClick = e => {
    e.preventDefault();
    const skipnum = this.state.limit * (parseInt(e.value) - 1);
    console.log(skipnum);

    const query = "?perPage=" + this.state.limit + "&pageNum=" + e.value;
    list({ query }).then(data => {
      if (data.error) {
        return this.setState({ error: data.error });
      }
      return this.setState({ skip: e.value, users: data.users });
    });
  };

  render() {
    // console.log(this.state.total);
    return (
      <div>
        {this.state.users.map((user, index) => {
          return (
            <div key={user._id} className="user-item">
              {index +
                1 +
                ((parseInt(this.state.skip) - 1) * parseInt(this.state.limit) || 0) +
                ". " +
                user.username}{" "}
              <Link to={"/profile/" + user._id}>
                <button>details</button>
              </Link>
              <hr />
            </div>
          );
        })}

        <Pagination
          handleClick={this.handleClick}
          totalData={Math.floor(this.state.total / (this.state.limit || 10))}
        />
      </div>
    );
  }
}

export default Members;
