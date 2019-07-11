import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ListItem from "./ListItem";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.generateListItem(nextProps.pageLength);
  }

  generateListItem = length => {
    console.log(list);
    const list = [];
    let item = null;
    for (let i = 0; i < length; i++) {
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
    return this.setState({ list });
  };

  render() {
    console.log(this.state.list);
    return <ul className="pagination">{this.state.list}</ul>;
  }
}

Pagination.propTypes = {
  pageLength: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Pagination;
