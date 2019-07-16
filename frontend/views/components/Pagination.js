import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import PrevNextBtn from "./PrevNextBtn";

class Pagination extends Component {
  // Nyontek saja, biar cepat.
  generateListItem = (activeNum, length) => {
    const list = [];
    const middle = [];
    const limit = 2;
    const pageDown = activeNum - limit;
    const pageUp = Math.max(activeNum + limit, 6);
    const limitDown = Math.max(2, pageDown);
    const limitUp = Math.min(length - 1, pageUp);
    const text = "dots";
    let item = null;
    let isActive = false;

    let firstPage;
    if (activeNum == 1) {
      firstPage = <ListItem className={"list-item active-page"} text={true} key={1} content={1} />;
    } else {
      firstPage = (
        <ListItem
          className={"list-item"}
          activePage={false}
          key={1}
          content={1}
          handleClick={this.props.handleClick}
          url={"/members/" + 1}
          value={1}
        />
      );
    }

    let lastPage;
    if (activeNum == length) {
      lastPage = (
        <ListItem className={"list-item active-page"} text={true} key={length} content={length} />
      );
    } else {
      lastPage = (
        <ListItem
          className={"list-item"}
          activePage={false}
          key={length}
          content={length}
          handleClick={this.props.handleClick}
          url={"/members/" + length}
          value={length}
        />
      );
    }

    list.push(firstPage, lastPage);

    // Loop 5 pages
    for (let num = limitDown; num <= limitUp; num++) {
      isActive = activeNum == num;
      item = (
        <ListItem
          className={"list-item" + (isActive ? " active-page" : "")}
          activePage={isActive}
          key={num}
          content={num}
          handleClick={this.props.handleClick}
          url={"/members/" + num}
          value={num}
        />
      );
      middle.push(item);
    }
    list.splice(1, 0, ...middle);

    // Determine where to give the dots
    if (limitDown > 2) {
      list.splice(
        1,
        0,
        <ListItem className="list-item" key={text + 1} content="..." text={true} />
      );
    }
    if (limitUp < length - 1) {
      list.splice(
        list.length - 1,
        0,
        <ListItem className="list-item" key={text + 2} content="..." text={true} />
      );
    }
    return list;
  };

  render() {
    const list = this.generateListItem(this.props.pagenum, this.props.pageLength);
    console.log(list);
    return (
      <Fragment>
        <PrevNextBtn
          text="Prev"
          handleClick={this.props.handleClick}
          value={this.props.pagenum - 1}
          active={this.props.pagenum - 2 < 0}
        />
        <ul className="pagination">{list}</ul>
        <PrevNextBtn
          text="Next"
          handleClick={this.props.handleClick}
          value={this.props.pagenum + 1}
          active={this.props.pagenum + 1 > this.props.pageLength}
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
