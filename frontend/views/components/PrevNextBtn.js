import React from "react";

function PrevNextBtn(props) {
  const thisClick = e => {
    e.stopPropagation();
    e.value = props.value;
    return props.handleClick(e);
  };

  return (
    <button
      onClick={thisClick}
      className={"prev-next-btn " + (props.AddtClass !== undefined ? props.AddtClass : "")}
      disabled={props.active}
    >
      {props.text}
    </button>
  );
}

export default PrevNextBtn;
