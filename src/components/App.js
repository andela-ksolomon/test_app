import React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { login, logout, resetNext } from '../actions/auth';
import {
    fetchForm
} from '../actions/form';
import { push } from 'react-router-redux';

//component
import Sidebar from './shared/Sidebar';
import Navbar from './shared/Navbar';

class App extends React.Component {
	state = {
		loaded: false,
		authenticated: false
	};

	styles = {
		app: {
			fontFamily: [
				'HelveticaNeue-Light',
				'Helvetica Neue Light',
				'Helvetica Neue',
				'Helvetica',
				'Arial',
				'Lucida Grande',
				'sans-serif'
			],
			fontWeight: 300
		},
		row: {
			'padding': 20
		}
	};

	componentWillMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					authenticated: true
				})
				this.props.onLogin(user);
				this.props.onRedirect(this.props.next || '/dashboard');
				this.props.onResetNext();
				firebase.database().ref(`/forms/${user.uid}`).on('value', (snapshot) => {
          console.log('i got here', snapshot.val());
					this.props.fetchUserForm(snapshot.val());
				})
			} else {
				if (this.props.user) {
					this.props.onRedirect('/');
					this.props.onResetNext();
				} else {
					this.props.onLogout();
				}
				this.setState({
					authenticated: false
				});
			}
			if (!this.state.loaded) {
				this.setState({ loaded: true });
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		console.log('nextProps', nextProps)
	}

	render() {
		const view1 = <div id="wrapper" style={ this.styles.app }>
			<Navbar />
			<div className="row">
				<div className="col-md-2">
					<Sidebar />
				</div>
				{ this.state.loaded ? this.props.children : <div id="loader"></div> }
			</div>
		</div>
		return (
			<div>
				{this.state.authenticated ? view1 :
				<div>
					{ this.state.loaded ? this.props.children : <div id="loader"></div> }
				</div>}
			</div>
		)
	}
}

export default connect(state => ({ next: state.auth.next, user: state.auth.user }), dispatch => ({
	onLogin: user => {
		dispatch(login(user));
	},
	onLogout: () => {
		dispatch(logout());
	},
	onRedirect: (path) => {
		dispatch(push(path));
	},
	onResetNext: () => {
		dispatch(resetNext());
	},
	fetchUserForm: forms => {
        dispatch(fetchForm(forms));
    }
}))(App);
