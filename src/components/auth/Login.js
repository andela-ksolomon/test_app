import React from "react";
import * as firebase from "firebase";
import { connect } from "react-redux";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.authService = firebase.auth();
  }
  state = {
    email: "",
    password: "",
    error: null,
    isLoading: false
  };

  /**
	 * handleSubmit - Handles Login form submission
	 * 
	 * @param {any} event 
	 * @memberof Login
	 */
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      isLoading: true,
      error: ""
    });
    this.authService
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({
          isLoading: false,
          error: ""
        });
      })
      .catch(error => {
        this.setState({ error: error.message, isLoading: false });
      });
  }

  /**
	 * onInputChange - Handles the onChange Listener
	 * 
	 * @param {any} name 
	 * @param {any} event 
	 * @memberof Login
	 */
  onInputChange(name, event) {
    var change = {};
    change[name] = event.target.value;
    this.setState(change);
  }

  render() {
    const { view } = this.props;
    var errors = this.state.error
      ? <p>
          {" "}{this.state.error}{" "}
        </p>
      : "";
    return (
      <form
        className={view === "login-form-link" ? "show" : "hide"}
        onSubmit={this.handleSubmit.bind(this)}
        id="login-form"
        action="#"
        method="post"
        role="form"
      >
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            name="login_email"
            id="login_email"
            tabIndex="1"
            className="form-control"
            placeholder="Email Address"
            value={this.state.email}
            onChange={this.onInputChange.bind(this, "email")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="login_password"
            id="login_password"
            tabIndex="2"
            className="form-control"
            placeholder="Password"
            value={this.state.password}
            onChange={this.onInputChange.bind(this, "password")}
          />
        </div>
        {/* <div className="form-group text-center">
					<input type="checkbox" tabIndex="3" className="" name="remember" id="remember" />
					<label htmlFor="remember">  Remember Me</label>
				</div> */}
        <br />
        {errors &&
          <div className="alert alert-danger">
            {errors}
          </div>}
        <br />
        <div className="form-group">
          <br />
          {this.state.isLoading &&
            <div
              style={{ left: "60%", width: "45px", height: "45px", top: "85%" }}
              id="loader"
            />}
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <input
                disabled={this.state.isLoading}
                type="submit"
                name="login-submit"
                id="login-submit"
                tabIndex="4"
                className="form-control btn btn-login"
                value="Sign In"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default connect()(Login);
