import React from "react";
import { connect } from "react-redux";
import * as firebase from "firebase";
import { login, logout, resetNext, fetchUserProfile } from "../actions/auth";
import { fetchForm, updateStats, saveQuestions } from "../actions/form";
import { push } from "react-router-redux";

//component
import Sidebar from "./shared/Sidebar";
import PeqQuestions from "./shared/PeqQuestions";
import moment from "moment";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dbRef = firebase.database();
    this.authRef = firebase.auth();
  }
  state = {
    loaded: false,
    authenticated: false
  };

  styles = {
    app: {
      fontFamily: [
        "HelveticaNeue-Light",
        "Helvetica Neue Light",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        "Lucida Grande",
        "sans-serif"
      ],
      fontWeight: 300
    },
    row: {
      padding: 20
    }
  };

  componentDidMount() {
    localStorage.setItem("questions", JSON.stringify(PeqQuestions));
    this.checkAuthentication();
  }

  /**
   * checkAuthentication - Checks if a user is authenticated
   * @return {void}
   * @memberof App
   */
  checkAuthentication() {
    this.authRef.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true
        });
        this.dbRef.ref().child(`users/${user.uid}`).on("value", snapshot => {
          this.props.fetchUserProfile(snapshot.val());
        });
        this.props.onLogin(user);
        this.props.onRedirect(this.props.next || "/dashboard");
        this.props.onResetNext();
        this.fetchForms(user);
      } else {
        if (!this.props.user) {
          this.props.onLogout();
        }
        this.props.onRedirect("/");
        this.props.onResetNext();
        this.setState({
          authenticated: false
        });
      }
      if (!this.state.loaded) {
        this.setState({ loaded: true });
      }
    });
  }

  /**
   * fetchForms - Fetches all forms from database
   * @param  {any} user 
   * @return {void}
   * @memberof App
   */
  fetchForms(user) {
    this.dbRef.ref("/forms").on("value", snapshot => {
      const questions = JSON.parse(localStorage.getItem("questions"));
      const allUsersForms = snapshot.val();
      if (allUsersForms) {
        let userTests = this.getUserTests(
          this.getAllUserForms(allUsersForms[user.uid])
        );
        let monthlyUserTests = this.getMonthlyUsersTests(userTests);
        let averageTests = this.getAverageTests(allUsersForms);
        this.props.updateStats(monthlyUserTests.length, averageTests);
        this.props.fetchUserForm(allUsersForms[user.uid]);
        this.props.saveQuestions(questions);
      }
    });
  }

  /**
 * getAllUserForms - Gets all the forms created by a user
 * @param  {any} forms 
 * @return {array} allForms - Contains all the user Form
 * @memberof App
 */
  getAllUserForms(forms) {
    let allForms = {};
    for (let status in forms) {
      if (forms.hasOwnProperty(status)) {
        allForms = {
          ...allForms,
          ...forms[status]
        };
      }
    }
    return allForms;
  }

  /**
 * getUserTests - Gets all tests for a particular user
 * @param  {any} forms 
 * @return 
 * @memberof App
 */
  getUserTests(forms) {
    const tests = [];
    for (let patientId in forms) {
      if (forms.hasOwnProperty(patientId)) {
        const form = forms[patientId].tests;
        for (let testCategory in form) {
          if (form.hasOwnProperty(testCategory)) {
            tests.push(form[testCategory]);
          }
        }
      }
    }
    return tests;
  }

  /**
 * getMonthlyUsersTests - Gets all tests for current month
 * @param  {any} userTests 
 * @return 
 * @memberof App
 */
  getMonthlyUsersTests(userTests) {
    let startDate = moment()
      .startOf("month")
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    let endDate = moment().endOf("month").add(1, "days").format("YYYY-MM-DD");
    let currentMonthTests = userTests.filter(tests => {
      let test = Object.values(tests)[0];
      return moment(test.date, "YYYY-M-D").isBetween(startDate, endDate);
    });
    return currentMonthTests;
  }

  /**
 * getAverageTests - Gets the average number of
 * created by all clinicians
 * @param  {any} allUsersData 
 * @return {number}
 * @memberof App
 */
  getAverageTests(allUsersData) {
    let sumOfTests = 0;
    let sumOfClinicians = 0;
    for (let userId in allUsersData) {
      if (allUsersData.hasOwnProperty(userId)) {
        sumOfClinicians++;
        let userTest = this.getUserTests(
          this.getAllUserForms(allUsersData[userId])
        );
        sumOfTests += userTest.length;
      }
    }
    return Math.ceil(sumOfTests / sumOfClinicians);
  }

  render() {
    const view1 = (
      <div className="wrapper" style={this.styles.app}>
        <Sidebar profile={this.props.profile} stats={this.props.stats} />
        <div className="main-panel" id="main-panel">
          {/* <Navbar />  */}
          {this.state.loaded ? this.props.children : <div id="loader" />}
        </div>
      </div>
    );
    return (
      <div>
        {this.state.authenticated
          ? view1
          : <div>
              {this.state.loaded ? this.props.children : <div id="loader" />}
            </div>}
      </div>
    );
  }
}

export default connect(
  state => ({
    next: state.auth.next,
    user: state.auth.user,
    profile: state.auth.profile,
    stats: state.form.stats
  }),
  dispatch => ({
    onLogin: user => {
      dispatch(login(user));
    },
    fetchUserProfile: user => {
      dispatch(fetchUserProfile(user));
    },
    onLogout: () => {
      dispatch(logout());
    },
    onRedirect: path => {
      dispatch(push(path));
    },
    onResetNext: () => {
      dispatch(resetNext());
    },
    fetchUserForm: forms => {
      dispatch(fetchForm(forms));
    },
    saveQuestions: questions => {
      dispatch(saveQuestions(questions));
    },
    updateStats: (totalUserTests, totalTests) => {
      dispatch(updateStats(totalUserTests, totalTests));
    }
  })
)(App);
