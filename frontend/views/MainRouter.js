import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Notification from "./components/Notification";
import auth from "./../auth/auth-helper";

import Menu from "./components/Menu";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Signin from "./components/SignIn";
import Register from "./components/SignUp";
import Members from "./components/Members";
import Profile from "./components/Profile";
import Signout from "./components/SignOut";
import DeletePage from "./components/DeletePage";
import Verify from "./components/Verify";

class MainRouter extends Component {
  state = {
    hideReq: false
  };
  shouldHideNotif = action => {
    this.setState({ hideReq: action });
  };
  render() {
    return (
      <div>
        <Notification hideReq={this.state.hideReq} shouldHideNotif={this.shouldHideNotif} />
        <Menu onSignout={this.shouldHideNotif} />
        {/* Routes here */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/signin" component={Signin} />
          <Route path="/register" component={Register} />
          <Route path="/members" component={Members} />
          <Route path="/profile/:user_id" component={Profile} />
          <Route path="/email/:findbyparam" component={Verify} />
          <Route path="/email/" component={Verify} />
          <Route path="/signout" component={Signout} />
          <Route path="/deleted" component={DeletePage} />
        </Switch>
        {/* end Routes*/}
      </div>
    );
  }
}

export default MainRouter;
