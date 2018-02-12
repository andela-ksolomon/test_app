import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import firebase from "firebase";
import SweetAlert from "react-bootstrap-sweetalert";

import ReportsTable from "../shared/ReportsTable";

class ViewRecords extends React.Component {
  state = {
    forms: [],
    isFound: "loading",
    alert: null,
    direction: {
      id: "asc",
      fullname: "asc",
      date: "asc"
    }
  };
  componentWillMount() {
    const { completedform } = this.props.forms || {};

    if (completedform) {
      let allForms = [];
      Object.keys(completedform).forEach(id => {
        allForms.push(completedform[id]);
      });
      if (allForms.length > 0) {
        this.setState({
          isFound: "yes",
          forms: allForms
        });
      } else {
        this.setState({
          isFound: "no"
        });
      }
    } else {
      this.setState({
        isFound: "no"
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { completedform } = nextProps.forms || {};
    if (completedform) {
      let allForms = [];
      Object.keys(completedform).forEach(id => {
        allForms.push(completedform[id]);
      });
      if (allForms.length > 0) {
        this.setState({
          isFound: "yes",
          forms: allForms
        });
      } else {
        this.setState({
          isFound: "no"
        });
      }
    } else {
      this.setState({
        isFound: "no"
      });
    }
  }

  /**
   * onDelete - Displays dialog for confirmation
   * 
   * @param {any} form 
   * @memberof ViewRecords
   */
  onDelete(form) {
    const getAlert = form =>
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Are you sure?"
        onConfirm={() => this.deleteForm(form)}
        onCancel={() => this.onCancelDelete()}
      >
        You will not be able to recover this report!
      </SweetAlert>;
    this.setState({
      alert: getAlert(form)
    });
  }

  /**
   * deleteForm - Handles deleting a form
   * 
   * @param {any} form 
   * @memberof ViewRecords
   */
  deleteForm(form) {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/forms/${userId}/completedform/${form.completedKey}`)
      .remove();
    this.setState({
      alert: null
    });
  }

  /**
   * onCancelDelete - Gets called when form deletion is rejected
   * 
   * @memberof ViewRecords
   */
  onCancelDelete() {
    this.setState({
      alert: null
    });
  }

  /**
   * sortFunction - Sorts Forms data based on order and column
   * 
   * @param {any} order 
   * @param {any} column 
   * @memberof ViewRecords
   */
  sortFunction(order, column) {
    let forms = this.state.forms.sort((a, b) => {
      switch (column) {
        case "id":
          return order === "asc"
            ? parseInt(b[column], 10) - parseInt(a[column], 10)
            : parseInt(a[column], 10) - parseInt(b[column], 10);
        case "fullname":
          let aFullname = a[column].toUpperCase();
          let bFullname = b[column].toUpperCase();
          if (order === "asc") {
            if (aFullname < bFullname) {
              return -1;
            }
            if (aFullname > bFullname) {
              return 1;
            }
            return 0;
          }
          if (order === "desc") {
            if (bFullname < aFullname) {
              return -1;
            }
            if (bFullname > aFullname) {
              return 1;
            }
            return 0;
          }
          return 0;
        case "date":
          return order === "asc"
            ? moment(b[column], "YYYY-MM-DD").utc().diff(moment.utc(a[column]))
            : moment(a[column], "YYYY-MM-DD").utc().diff(moment.utc(b[column]));
        default:
          return a[column] < b[column];
      }
    });
    this.setState({
      forms,
      direction: {
        [column]: order
      }
    });
  }

  render() {
    let { forms, isFound, direction } = this.state;
    const completedForm = forms.filter(form => form.completed === 1);
    return (
      <div id="wrapper">
        {this.state.alert}
        {isFound === "loading" && <div id="loader" />}
        <div className="records col-xs-10">
          <div className="container card">
            <br />
            <div className="header">
              <h4 className="title">Completed Reports</h4>
              <p className="category">Lists of Reports that are completed</p>
              {/*  <Link className="pull-right" to="/createform">
                <button className="col-xs-offset-1 btn-fill btn btn-success">
                  <span className="glyphicon btn-glyphicon glyphicon-plus img-circle text-success" />
                  Create a New Report
                </button>
              </Link> 
            */}
            </div>
            <ReportsTable
              status="completedform"
              data={forms}
              onDelete={this.onDelete.bind(this)}
              sortBy={this.sortFunction.bind(this)}
              direction={direction}
            />
            {isFound === "no" &&
              <h4 className="title text-center">No completed reports.</h4>}
            {isFound === "yes" &&
              completedForm.length === 0 &&
              <h4 className="title text-center">No completed reports.</h4>}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  forms: state.form.forms
}))(ViewRecords);
