import React, { Component } from "react";
import hasher from "./../../../functions/hasher";
import { tokenExpired } from "./../../../functions/user";
// import { getCurrentUser } from "./../../apis/user-api";
import auth from "./../../auth/auth-helper";
import auths from "./../../auth/user-auth";
import NotifBar from "./NotifBar";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Your email address need to be verified.",
      loading: false,
      hideButtons: false
    };
    // console.log(props.hideReq);
  }

  componentDidUpdate(prevProps, prevState) {}

  showNotification = () => {
    if (!auth.isLoggedIn()) {
      return false;
    }
    const { confirmed, tokenCreation } = auth.isLoggedIn().loggedIn_user;
    const expired = tokenExpired(new Date(tokenCreation));
    if (confirmed == false && expired == true) {
      return true;
    }
    return false;
  };

  handleCLick = e => {
    const { className } = e.target;

    // close notification bar
    if (className == "close") {
      return this.props.shouldHideNotif(true);
    }

    if (className == "verify") {
      const { _id, email } = auth.isLoggedIn().loggedIn_user;
      const mailSalt = hasher.createSalt();
      const mailToken = hasher.createHash(email, mailSalt);
      const tokenCreation = new Date();
      const data = { email, mailToken };

      this.setState({ loading: true });
      // save them to database
      auths
        .updateMailToken({ email: email + "/?email", mailToken, mailSalt, tokenCreation })
        .then(response => {
          this.props.shouldHideNotif(false);
          if (response.verified) {
            return this.setState({
              message: response.verified,
              loading: false,
              hideButtons: false
            });
          }

          if (response.error) {
            return this.setState({
              message: response.error,
              loading: false,
              hideButtons: false
            });
          }

          // if Success
          if (response.success) {
            console.log("Before send email");
            // Send to the user's email
            auths.sendTheEmail(data).then(res => {
              if (!res) {
                return this.setState({
                  message: "Something went wrong.. Please try again or contact us!",
                  loading: false,
                  hideButtons: false
                });
              }

              const { accepted, rejected } = res.response;
              console.log(accepted[1], accepted.length, rejected);

              if (accepted.length == 1) {
                // Close notification bar
                /*  setTimeout(() => {
                this.setState({ hideRequest: true });
              }, 1000 * 60 * 0.05); */

                return this.setState({
                  message:
                    "Email sent! Please check your email's inbox or spam folder for the new verification link!",
                  loading: false,
                  hideButtons: true
                });
              }

              if (rejected.length == 1) {
                return this.setState({
                  message: "Something went wrong.. Please try again or contact us!",
                  loading: false,
                  hideButtons: false
                });
              }
            });
            console.log("after send email");

            return this.setState({
              message: "Please wait while new verification email is sent!",
              loading: true,
              hideButtons: true
            });
          }
        });
    }
  };

  render() {
    // If user is logged in and token is expired and email is not confirmed
    // console.log(this.props.hideReq);
    if (this.props.hideReq == true || !this.showNotification()) return "";
    return <NotifBar actions={this.state} onClick={this.handleCLick} />;
  }
}

export default Notification;
