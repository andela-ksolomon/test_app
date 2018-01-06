import React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { login, logout, resetNext, fetchUserProfile } from '../actions/auth';
import {
    fetchForm,
    updateStats
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
				firebase.database().ref().child(`users/${user.uid}`)
					.on('value', (snapshot) => {
						this.props.fetchUserProfile(snapshot.val());
					})
				this.props.onLogin(user);
				this.props.onRedirect(this.props.next || '/dashboard');
				this.props.onResetNext();
				firebase.database().ref('/forms').on('value', (snapshot) => {
          const allForms = snapshot.val();
          let totalTests = 0;
          let totalUserTests = 0
          Object.keys(allForms).forEach((userForms) => {
            Object.keys(allForms[userForms]).forEach((form) => {
              if (allForms[userForms][form].tests) {
                Object.keys(allForms[userForms][form].tests).forEach((category) => {
                  Object.keys(allForms[userForms][form].tests).forEach((test) => {
                    totalTests += 1;
                    if(userForms === user.uid) {
                      totalUserTests += 1;
                    }
                  })
                })
              }
            })
          })
          this.props.updateStats(totalUserTests, totalTests);
					this.props.fetchUserForm(allForms[user.uid]);
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

	render() {
		const view1 = <div id="wrapper" style={ this.styles.app }>
			<Navbar />
			<div className="row">
				<div className="col-md-2">
					<Sidebar user={this.props.user} stats={this.props.stats} />
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

export default connect(state => ({
  next: state.auth.next,
  user: state.auth.user,
  stats: state.form.stats }), dispatch => ({
	onLogin: user => {
		dispatch(login(user));
  },
  fetchUserProfile: user => {
		dispatch(fetchUserProfile(user));
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
  },
  updateStats: (totalUserTests, totalTests) => {
    dispatch(updateStats(totalUserTests, totalTests));
  }
}))(App);
