import React, { Component, Fragment } from "react";
import MainRouter from "./MainRouter";
import { BrowserRouter } from "react-router-dom";
import Notification from "./components/Notification";
import auth from "./../auth/auth-helper";
import "./../sass/style.scss";
import "./../sass/pagination.scss";

class App extends Component {
  render() {
    // <BrowserRouter>{auth.isLoggedIn() && <Notification />}</BrowserRouter>
    return (
      <Fragment>
        <BrowserRouter>
          <MainRouter />
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;
