import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ListItem from "./ListItem";

class Pagination extends Component {
  render() {
    const list = [];
    let item = null;
    for (let i = 0; i < this.props.totalData; i++) {
      item = (
        <ListItem
          className="list-item"
          key={i}
          content={i + 1}
          handleClick={this.props.handleClick}
          url="!#"
          value={i + 1}
        />
      );
      list.push(item);
    }
    return <ul className="pagination">{list}</ul>;
  }
}

Pagination.propTypes = {
  totalData: PropTypes.number.isRequired
};

export default Pagination;
