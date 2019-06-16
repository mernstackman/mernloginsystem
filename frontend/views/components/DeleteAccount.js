import React from "react";
import PropTypes from "prop-types";

const DeleteAccount = props => {
  console.log(props.delDial.showDeleteDialog);
  return (
    props.delDial.showDeleteDialog && (
      <div>
        <div id="modal_bg" onClick={props.deleteAccount} />

        <div id="delete_dialog">
          <span className="close_dialog" onClick={props.deleteAccount}>
            x
          </span>
          {props.delDial.showError && (
            <p>
              <span>{props.delDial.errorContent}</span>
            </p>
          )}

          {props.delDial.question && (
            <div className="question">
              <h3>Are you sure you want to delete your accout?</h3>
              <button onClick={props.deleteAccount}>Yes</button>{" "}
              <button onClick={props.deleteAccount}>No</button>
            </div>
          )}
          {props.delDial.confirmPassword && (
            <div className="confirm_password">
              <h3>Please enter your password!</h3>
              <input
                type="password"
                name="password_confirm"
                value={props.delDial.password}
                id=""
                onChange={props.handleChange}
              />
              <button onClick={props.deleteAccount}>Confirm</button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

DeleteAccount.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  delDial: PropTypes.object.isRequired
};

export default DeleteAccount;
