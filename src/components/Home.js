import React from 'react'
import * as firebase from 'firebase';
import { connect } from 'react-redux'
import { Link } from 'react-router';

import '../assets/css/home.css';

//components
import Login from './auth/Login';
import Register from './auth/Register';

class Home extends React.Component {

	state = {
		email: '',
		password: '',
		error: null
	};

	handleSubmit(event) {
		event.preventDefault();
		firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
			.catch((error) => {
				this.setState({ error: error });
			});
	}

	onInputChange(name, event) {
		var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}

	render() {
		return (
			<div>
			<div id="fullscreen_bg" className="fullscreen_bg" />
			<div id="regContainer" className="container">
			<div className="row">
			<div className="col-md-6 col-md-offset-3">
			  <div className="panel panel-login">
				<div className="panel-heading">
				  <div className="row">
					<div className="col-xs-6">
					  <Link href="#" className="active" id="login-form-link">Login</Link>
					</div>
					<div className="col-xs-6">
					  <Link href="#" id="register-form-link">Register</Link>
					</div>
				  </div>
				  <hr />
				</div>
				<div className="panel-body">
				  <div className="row">
					<div className="col-lg-12">
					  <Login />
					  <Register />
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
		</div>
		)
	}
}

export default connect()(Home);
