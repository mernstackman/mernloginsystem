import React, { Component } from "react";
import dateformat from "dateformat";
import { getCurrentUser, updateCurrentUser, moveAndDelete } from "./../../apis/user-api";
import auth from "./../../auth/auth-helper";
import { Link } from "react-router-dom";
import DeleteAccount from "./DeleteAccount";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      user: "",
      editEmail: false,
      redirToSignIn: false,
      canEdit: false,
      delDial: {
        showDeleteDialog: false,
        question: true,
        confirmPassword: false,
        password_confirm: "",
        showError: false,
        errorContent: ""
      }
    };
  }

  loginInfo = auth.isLoggedIn();

  renderCurrentUser = user_id => {
    if (!this.loginInfo) return false;
    getCurrentUser({ _id: user_id }, { t: this.loginInfo.token }).then(result => {
      if (result.error) {
        return this.setState({
          redirToSignIn: true
        });
      }
      // console.log(result);
      const info = {
        _id: result._id,
        fullname: result.fullname,
        username: result.username,
        email: result.email,
        created: result.created,
        updated: result.updated,
        confirmed: result.confirmed,
        updateCount: result.updateCount
      };
      this.setState({
        user_id,
        user: info
      });
      return info;
    });
  };

  canEdit = reqId => {
    if (!this.loginInfo.loggedIn_user) return;
    if (this.loginInfo.loggedIn_user._id === reqId) {
      return this.setState({
        canEdit: true
      });
    }
  };

  /* getDerivedStateFromProps = props => {
    const param_id = props.match.params.user_id;
    this.renderCurrentUser(param_id);
    this.canEdit(param_id);
  }; */

  componentDidMount = () => {
    document.title = this.props.title;
    const param_id = this.props.match.params.user_id;
    this.renderCurrentUser(param_id);
    this.canEdit(param_id);
  };

  toggleEmail = e => {
    /*     
    console.log(e.target.parentElement.children);
    console.log(e.target.tagName); 
    */
    if (!this.loginInfo) return;
    const { loggedIn_user, token } = this.loginInfo;
    const btnval = e.target.firstChild.data;

    if (btnval === "save") {
      // Check if the supplied data is valid email and the email is not the same as the previous one
      // Find how to read email validation error message from mongoose
      const { _id, ...body } = { ...this.state.user };
      if (!/.+\@.+\..+/.test(body.email) || body.email === loggedIn_user.email) {
        return console.log(
          "Please supply a valid email pattern that doesn't match current email address!"
        );
      }
      body.updated = new Date();
      body.updateCount += 1;

      updateCurrentUser({ _id: loggedIn_user._id }, { t: token }, { body }).then(response => {
        if (response.error) return console.log(response.error);

        // Should update sessionstorage here in order to maintain value on cancel
        this.loginInfo.loggedIn_user = body;
        sessionStorage.removeItem("jwt");
        sessionStorage.setItem("jwt", JSON.stringify(this.loginInfo));
        setTimeout(() => {
          console.log(sessionStorage.getItem("jwt"));
          console.log(response);
        }, 2000);
        return this.props.history.push("/profile/" + loggedIn_user._id);
      });
    }

    if (btnval === "cancel") {
      // console.log(loggedIn_user);
      // console.log(sessionStorage.getItem("jwt"));
      this.setState({
        user: loggedIn_user
      });
    }

    this.setState({
      editEmail: !this.state.editEmail
    });
  };

  handleChange = e => {
    if (e.target.name.includes("nested")) {
      // console.log(e.target.name.replace(/_.*$/g, ""));
      let info = { ...this.state.user };
      info[e.target.name.replace(/_.*$/g, "")] = e.target.value;
      return this.setState({
        user: info
      });
    }

    if (e.target.name === "password_confirm") {
      const deleteDialog = { ...this.state.delDial };
      deleteDialog[e.target.name] = e.target.value;
      return this.setState({
        delDial: deleteDialog
      });
    }

    this.setState({
      [e.target.name]: e.target.value
    });
  };

  /*   getValueByName = (parent, attrValue) => {
    const elems = parent.getElementsByTagName("input");
    // const elCounts = elems.length;
    for (var i = 0; i < elems.length; i++) {
      if (elems[i].getAttribute("name") === attrValue) {
        return elems[i].value;
      }
    }
  }; */

  closeModal = data => {
    data.question = true;
    data.password_confirm = "";
    data.showError = false;
    data.errorContent = "";
    data.confirmPassword = false;
    data.showDeleteDialog = !this.state.delDial.showDeleteDialog;
    this.setState({
      delDial: data
    });
  };

  deleteAccount = e => {
    e.preventDefault();

    const deleteDialog = { ...this.state.delDial };
    const clicked = e.target.firstChild;
    if (
      e.target.className === "delete_link" ||
      e.target.className === "close_dialog" ||
      clicked === null ||
      clicked.data === "No"
    ) {
      // console.log(this.state.delDial.password_confirm);
      return this.closeModal(deleteDialog);
    }

    if (clicked.data === "Yes") {
      deleteDialog.question = false;
      deleteDialog.confirmPassword = true;
      return this.setState({ delDial: deleteDialog });
    }

    if (clicked.data === "Confirm") {
      if (this.state.delDial.password_confirm === "") {
        deleteDialog.showError = true;
        deleteDialog.errorContent = "Please enter your password!";
        return this.setState({ delDial: deleteDialog }); // Show message to the user
      }

      const data = {
        ...this.loginInfo.loggedIn_user,
        password: this.state.delDial.password_confirm
      };

      // Back up and delete
      moveAndDelete({ userData: data }, { token: this.loginInfo.token }).then(response => {
        console.log(response); // response from backend not sent here.

        if (response.error) {
          deleteDialog.showError = true;
          deleteDialog.errorContent = response.error;
          return this.setState({ delDial: deleteDialog }); // Show message to user
        }

        // Empty sessionstorage/ logout user
        auth.signOut(data => {
          // Redirect to delete confirmation page
          console.log("It went here!");
          this.props.history.push("/deleted");
        });
      });
    }
  };

  render() {
    if (!auth.isLoggedIn()) {
      return (
        <div>
          <h1>Please login to see the user's detail!</h1>
        </div>
      );
    }
    // console.log(this.props.location.pathname);
    const { _id, fullname, username, email, created, confirmed } = this.state.user;
    return (
      <div id="profile_view">
        <h1>{fullname}</h1>
        <p>Username : {username}</p>
        <p>
          Email :{" "}
          {!this.state.editEmail ? (
            <React.Fragment>
              {email} {this.state.canEdit && <button onClick={this.toggleEmail}>edit</button>}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input type="text" name="email_nested" onChange={this.handleChange} value={email} />{" "}
              <button onClick={this.toggleEmail}>cancel</button>
              <button onClick={this.toggleEmail}>save</button>
            </React.Fragment>
          )}
        </p>
        <p>Joined : {dateformat(created, "dddd, dd mmmm yyyy, HH:mm:ss")}</p>
        <p>ID : {_id}</p>
        <p>Confirmed : {confirmed == true ? "Yes" : "No"}</p>
        {this.state.canEdit && (
          <div>
            <p>
              <Link
                to={this.props.location.pathname + "/delete"}
                onClick={this.deleteAccount}
                className="delete_link"
              >
                Delete your account
              </Link>
            </p>
            <DeleteAccount
              deleteAccount={this.deleteAccount}
              handleChange={this.handleChange}
              delDial={this.state.delDial}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Profile;
