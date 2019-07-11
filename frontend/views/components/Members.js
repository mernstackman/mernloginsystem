import qs from "query-string";
import React, { Component } from "react";
import { list } from "./../../apis/user-api";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import bigloader from "./../../img/bigloader.gif";

class Members extends Component {
  constructor(props) {
    super(props);

    const query = qs.parse(props.location.search);
    const limit = query.pp || query.perPage || 10;
    const pagenum = query.pn || query.pageNum || 1;

    this.state = {
      users: [],
      limit,
      pagenum,
      total: 0,
      loading: true,
      pageTitle: "Members"
    };
  }

  componentDidMount() {
    document.title = this.props.title;
    const { limit, pagenum } = this.state;
    const query = "?perPage=" + limit + "&pageNum=" + pagenum;
    console.log(query);
    list({ query }).then(data => {
      if (data.error) {
        return this.setState({ error: data.error });
      }
      const total = Math.floor(data.total / (limit || 10));
      return this.setState({ loading: false, total, users: data.users });
    });
  }

  handleClick = e => {
    e.preventDefault();
    this.setState({
      loading: true
    });
    // const skipnum = this.state.limit * (parseInt(e.value) - 1);
    // console.log(skipnum);

    const query = "?perPage=" + this.state.limit + "&pageNum=" + e.value;

    list({ query }).then(data => {
      if (data.error) {
        return this.setState({ error: data.error });
      }
      if (history.pushState) {
        history.pushState(null, "", "/members/" + query);
      }
      document.title = `Members | Page ${e.value}`;
      return this.setState({ loading: false, pagenum: e.value, users: data.users });
    });
  };

  render() {
    console.log(this.state.total);
    return (
      <div id="member-list">
        {this.state.loading && (
          <div id="loading-background">
            <img src={bigloader} alt="big loading gif" />
          </div>
        )}
        {this.state.users.map((user, index) => {
          return (
            <div key={user._id} className="user-item">
              {index +
                1 +
                ((parseInt(this.state.pagenum) - 1) * parseInt(this.state.limit) || 0) +
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
          pageLength={this.state.total}
          pagenum={this.state.pagenum}
        />
      </div>
    );
  }
}

export default Members;
