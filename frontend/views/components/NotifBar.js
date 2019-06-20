import React, { Component, Fragment } from "react";
import loadingGIF from "./../../img/loading.gif";

export class NotifBar extends Component {
  render() {
    const { onClick, actions } = this.props;
    const { message, loading, hideButtons } = actions;
    console.log(this.props);

    return (
      <Fragment>
        <div className="text">
          {message}
          {loading && (
            <Fragment>
              <img src={loadingGIF} />{" "}
            </Fragment>
          )}
        </div>
        {hideButtons == false && (
          <div className="buttonsCon">
            <button onClick={onClick} className="verify" disabled={loading}>
              Verify
            </button>
            <button className="close" onClick={onClick} disabled={loading}>
              x
            </button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default NotifBar;
