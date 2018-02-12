import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import firebase from "firebase";
import SweetAlert from "react-bootstrap-sweetalert";
import { Link } from "react-router";
import SortCaret from "./SortCaret";

class ViewRecords extends React.Component {
  state = {
    forms: [],
    isFound: "loading",
    alert: null,
    allColumns: ["id", "fullname", "date"],
    currentColumn: "",
    id: {
      order: "descend"
    },
    fullname: {
      order: "ascend"
    },
    date: {
      order: "ascend"
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

  deleteForm(form) {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/forms/${userId}/completedform/${form.id}`)
      .remove();
    this.setState({
      alert: null
    });
  }

  onCancelDelete() {
    this.setState({
      alert: null
    });
  }

  selectColumn(column) {
    this.setState({
      currentColumn: column
    });
  }

  sortFunction(order, column) {
    let forms = this.state.forms.sort((a, b) => {
      switch (column) {
        case "id":
          return order !== "ascend"
            ? parseInt(a[column], 10) > parseInt(b[column], 10)
            : parseInt(a[column], 10) < parseInt(b[column], 10);
        case "fullname":
          let aFullname = a[column].toUpperCase();
          let bFullname = b[column].toUpperCase();
          return order !== "ascend"
            ? aFullname > bFullname
            : aFullname < bFullname;
        case "date":
          return order !== "ascend"
            ? moment.utc(b[column]).diff(moment.utc(a[column]))
            : moment.utc(a[column]).diff(moment.utc(b[column]));
        default:
          return a[column] < b[column];
      }
    });
    this.setState({
      forms,
      [column]: {
        order: order
      }
    });
  }

  render() {
    let { forms, isFound, id, fullname, date } = this.state;
    const noofTests = tests => {
      let sum = 0;
      if (tests && Object.keys(tests).length > 0) {
        Object.keys(tests).forEach(category => {
          sum += Object.keys(tests[category]).length;
        });
      }
      return sum;
    };
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
            <div className="content table-full-width table-responsive">
              {forms &&
                completedForm.length > 0 &&
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>
                        ID
                        <SortCaret
                          order={id.order}
                          column="id"
                          sortFunction={this.sortFunction.bind(this)}
                        />
                        <a />
                      </th>
                      <th>
                        Patient
                        <SortCaret
                          order={fullname.order}
                          column="fullname"
                          sortFunction={this.sortFunction.bind(this)}
                        />
                      </th>
                      <th>
                        Created Date
                        <SortCaret
                          order={date.order}
                          column="date"
                          sortFunction={this.sortFunction.bind(this)}
                        />
                      </th>
                      <th>No. of Tests</th>
                      <th>
                        <span id="action_text">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedForm.map((form, i) =>
                      <tr key={i}>
                        <td>
                          {form.id}
                        </td>
                        <td>
                          {form.fullname}
                        </td>
                        <td>
                          {form.date}
                        </td>
                        <td>
                          <span id="test-no">
                            {noofTests(form.tests)}
                          </span>
                        </td>
                        <td>
                          <Link to={`/test/completedform/${form.completedKey}`}>
                            <button className="col-xs-offset-1 btn-fill btn btn-info">
                              <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-info" />
                              View Report
                            </button>
                          </Link>
                          <button
                            onClick={this.onDelete.bind(this, form)}
                            className="btn-fill btn btn-danger"
                          >
                            <span className="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger" />
                            Delete Report
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>}
              <div className="footer">
                <div className="stats">
                  <i />
                </div>
              </div>
            </div>
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
