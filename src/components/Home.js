import React from "react";
import * as firebase from "firebase";
import { connect } from "react-redux";
import { Link } from "react-router";
import { push } from "react-router-redux";

import "../assets/css/home.css";

//components
import Login from "./auth/Login";
import Register from "./auth/Register";

class Home extends React.Component {
  /**
   * defines the application states
   * 
   * @memberof Home
   */
  state = {
    email: "",
    password: "",
    error: null,
    view: "login-form-link"
  };

  componentDidMount() {
    if (firebase.auth().currentUser) {
      this.props.onRedirect(this.props.next || "/dashboard");
    }
  }

  /**
   * onInputChange - Handles the onChange handler
   * 
   * @param {any} name 
   * @param {any} event 
   * @memberof Home
   */
  onInputChange(name, event) {
    var change = {};
    change[name] = event.target.value;
    this.setState(change);
  }

  /**
   * switchView - Handles Switching of Authentication Screens
   * @param {any} event 
   * @memberof Home
   */
  switchView(event) {
    event.preventDefault();
    this.setState({
      view: event.target.id
    });
  }

  render() {
    const { view } = this.state;
    return (
      <div>
        <div id="fullscreen_bg" className="fullscreen_bg" />
        <img id="logo" src="/images/aopa.png" alt="logo" />
        <div id="regContainer" className="container">
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <div className="panel panel-login">
                <div className="panel-heading">
                  <div className="row">
                    <div className="col-xs-6">
                      <Link
                        onClick={e => this.switchView(e)}
                        className={view === "login-form-link" ? "active" : ""}
                        id="login-form-link"
                      >
                        Login
                      </Link>
                    </div>
                    <div className="col-xs-6">
                      <Link
                        className={
                          view === "register-form-link" ? "active" : ""
                        }
                        onClick={e => this.switchView(e)}
                        id="register-form-link"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                  <hr />
                </div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-lg-12">
                      <Login view={view} />
                      <Register view={view} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, dispatch => ({
  onRedirect: path => {
    dispatch(push(path));
  }
}))(Home);
