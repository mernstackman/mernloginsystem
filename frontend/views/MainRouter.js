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
import ResetPassword from "./components/ResetPassword";

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
          <Route exact path="/" render={props => <Home {...props} title={"MERN Login System"} />} />
          <Route path="/about" render={props => <About {...props} title={"About"} />} />
          <Route path="/contact" render={props => <Contact {...props} title={"Contact"} />} />
          <Route path="/signin" render={props => <Signin {...props} title={"Signin"} />} />
          <Route path="/register" render={props => <Register {...props} title={"Register"} />} />
          <Route path="/members" render={props => <Members {...props} title={"Members"} />} />
          <Route
            path="/profile/:user_id"
            render={props => <Profile {...props} title={"Profile"} />}
          />
          <Route
            path="/email/:findbyparam"
            render={props => <Verify {...props} title={"Verify"} />}
          />
          <Route path="/email/" render={props => <Verify {...props} title={"Verify"} />} />
          <Route path="/signout" render={props => <Signout {...props} title={"Signout"} />} />
          <Route path="/deleted" render={props => <DeletePage {...props} title={"DeletePage"} />} />
          <Route
            path="/password/recovery/:findbyparam"
            render={props => <ResetPassword {...props} title={"ResetPassword"} />}
          />
          <Route
            path="/password/recovery/"
            render={props => <ResetPassword {...props} title={"ResetPassword"} />}
          />
        </Switch>
        {/* end Routes*/}
      </div>
    );
  }
}

export default MainRouter;
