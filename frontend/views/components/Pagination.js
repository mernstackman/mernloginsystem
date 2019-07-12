import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import PrevNextBtn from "./PrevNextBtn";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pageLength: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pageLength: nextProps.pageLength
    });
    this.generateListItem(nextProps.pageLength);
    console.log(nextProps.pageLength);
  }

  generateListItem = length => {
    const list = [];
    let item = null;
    let active = false;
    for (let i = 0; i < length; i++) {
      active = this.props.pagenum == i + 1;
      item = (
        <ListItem
          className={"list-item" + (active ? " active-page" : "")}
          activePage={active}
          key={i}
          content={i + 1}
          handleClick={this.props.handleClick}
          url={"/members/" + (i + 1)}
          value={i + 1}
        />
      );
      list.push(item);
    }
    return this.setState({ list });
  };

  render() {
    return (
      <Fragment>
        <PrevNextBtn
          text="Prev"
          handleClick={this.props.handleClick}
          value={this.props.pagenum - 1}
          active={this.props.pagenum - 2 < 0}
        />
        <ul className="pagination">{this.state.list}</ul>
        <PrevNextBtn
          text="Next"
          handleClick={this.props.handleClick}
          value={this.props.pagenum + 1}
          active={this.props.pagenum + 1 > this.state.pageLength}
        />
      </Fragment>
    );
  }
}

Pagination.propTypes = {
  pageLength: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Pagination;
