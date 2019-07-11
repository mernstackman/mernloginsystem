import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const ListItem = props => {
  const thisClick = e => {
    e.stopPropagation();
    e.value = props.value;
    return props.handleClick(e);
  };

  return (
    <li className={props.className} onClick={thisClick}>
      <NavLink to={props.url} onClick={thisClick}>
        {props.content}
      </NavLink>
    </li>
  );
};

ListItem.propTypes = {
  //   key: PropTypes.string.isRequired,
  className: PropTypes.string,
  content: PropTypes.node.isRequired
};

export default ListItem;
