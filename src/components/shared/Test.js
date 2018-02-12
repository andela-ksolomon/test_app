import React from "react";
import moment from "moment";
import firebase from "firebase";
import SweetAlert from "react-bootstrap-sweetalert";
import CreateTest from "../shared/CreateTest";
import PdfPreviewer from "./PdfPreviewer";

class Test extends React.Component {
  state = {
    allTestCategory: ["TUG TEST", "L TEST", "PEQ TEST", "4 STEP SQUARE TEST"],
    selectedTest: "",
    selectedCategory: "",
    successMessage: "",
    alert: null,
    downloadTest: {}
  };
  style = {
    addButton: {
      marginTop: 15,
      marginLeft: 150
    }
  };

  selectCategory(selectedCategory) {
    this.setState({
      selectedCategory
    });
  }

  editTest(test, selectedCategory) {
    this.setState({
      selectedTest: test,
      selectedCategory
    });
  }

  onDelete(test) {
    const getAlert = test =>
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Are you sure?"
        onConfirm={() => this.deleteTest(test)}
        onCancel={() => this.onCancelDelete()}
      >
        You will not be able to recover this test!
      </SweetAlert>;

    this.setState({
      alert: getAlert(test)
    });
  }

  onCompleted(test) {
    const getAlert = () =>
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, Mark as Completed"
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="default"
        title="Are you sure?"
        onConfirm={() => this.completeForm()}
        onCancel={() => this.onCancelDelete()}
      >
        You will not be able to add new test!
      </SweetAlert>;

    this.setState({
      alert: getAlert()
    });
  }

  downloadPdf(downloadTest) {
    this.setState({
      downloadTest
    });
  }

  deleteTest(test) {
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(
        `/forms/${userId}/${this.props.status}/${this.props.formValue
          .id}/tests/${test.category}/${test.id}`
      )
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

  completeForm() {
    const userId = firebase.auth().currentUser.uid;
    const newUpdates = this.props.formValue;
    newUpdates.completed = 1;
    const updateRef = firebase
      .database()
      .ref(`/forms/${userId}/completedform/`);
    const pushInstance = updateRef.push();
    const completedKey = pushInstance.key;
    newUpdates.completedKey = completedKey;
    pushInstance.set(newUpdates).then(() => {
      this.setState({
        successMessage: `This report has been marked as completed`,
        alert: null
      });
    });
    firebase
      .database()
      .ref(`/forms/${userId}/pendingform/${this.props.formValue.id}`)
      .remove();
  }

  resetValue(selectedTest, selectedCategory) {
    this.setState({
      selectedTest,
      selectedCategory
    });
  }

  flattenData(data) {
    let result = [];
    Object.keys(data).forEach(category => {
      Object.keys(data[category]).forEach(test => {
        result.push(data[category][test]);
      });
    });
    return result;
  }

  render() {
    const allTests = this.props.formValue.tests
      ? this.flattenData(this.props.formValue.tests)
      : null;

    return (
      <div id="wrapper">
        {this.state.alert}
        <div className="records col-xs-12">
          {this.state.successMessage &&
            <div className="alert alert-success">
              {this.state.successMessage}
            </div>}
          <div className="content table-full-width table-responsive">
            {this.props.formValue.completed !== 1 &&
              <button
                onClick={this.onCompleted.bind(this)}
                className="btn-fill btn btn-success"
              >
                <span className="glyphicon btn-glyphicon glyphicon-check img-circle text-success" />
                Finish Session
              </button>}
            {this.props.formValue.completed !== 1 &&
              <div className="pull-right">
                <div className="input-group-btn">
                  <button
                    type="button"
                    className="btn btn-info"
                    data-toggle="dropdown"
                  >
                    {this.state.selectedCategory || "Select an Outcome Test"}
                    <span className="caret" />
                  </button>
                  <ul className="dropdown-menu pull-left" role="menu">
                    {this.state.allTestCategory.map((testCategory, i) =>
                      <li key={i}>
                        <a
                          onClick={this.selectCategory.bind(this, testCategory)}
                        >
                          {testCategory}
                        </a>
                      </li>
                    )}
                  </ul>
                  <button
                    disabled={!this.state.selectedCategory}
                    onClick={this.editTest.bind(
                      this,
                      "",
                      this.state.selectedCategory
                    )}
                    data-toggle="modal"
                    data-target="#videoModal"
                    className="btn-fill btn btn-info"
                    type="button"
                  >
                    <span className="glyphicon btn-glyphicon glyphicon-plus img-circle text-info" />Add
                    Outcome Test
                  </button>
                </div>
                <br />
              </div>}
            {allTests && allTests.length > 0
              ? <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Measured On</th>
                      <th>
                        <span id="action_text">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTests &&
                      allTests.map((test, i) =>
                        <tr key={i}>
                          <td>
                            {test["title"]}
                          </td>
                          <td>
                            {test["category"]}
                          </td>
                          <td>
                            {moment(test.date, "YYYY-MM-DD").format(
                              "YYYY-MM-DD"
                            )}
                          </td>
                          <td>
                            {this.props.formValue.completed !== 1 &&
                              <button
                                onClick={this.editTest.bind(
                                  this,
                                  test["id"],
                                  test["category"]
                                )}
                                data-toggle="modal"
                                data-target="#videoModal"
                                className="btn-fill btn-sm btn btn-info"
                              >
                                <span className="glyphicon btn-glyphicon glyphicon-pencil img-circle text-info" />
                                Edit
                              </button>}
                            <button
                              onClick={this.onDelete.bind(this, test)}
                              className="btn-fill btn-sm btn btn-danger"
                            >
                              <span className="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger" />
                              Delete
                            </button>
                            <button
                              onClick={this.downloadPdf.bind(this, test)}
                              className="btn-fill btn btn-sm btn-info"
                              data-toggle="modal"
                              data-target="#pdfModal"
                            >
                              <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-info" />
                              Preview
                            </button>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              : <p>
                  <h4 className="text-center">
                    No outcome tests have been performed.
                  </h4>
                </p>}
            <div className="footer">
              <div className="stats">
                <i />
              </div>
            </div>
          </div>
        </div>
        <CreateTest
          tests={this.props.formValue.tests}
          questions={this.props.questions}
          selectedTest={this.state.selectedTest}
          selectedCategory={this.state.selectedCategory}
          formId={this.props.formValue.id}
          resetValue={this.resetValue.bind(this)}
        />
        <PdfPreviewer
          profile={this.props.profile}
          test={this.state.downloadTest}
          formValue={this.props.formValue}
        />
      </div>
    );
  }
}

export default Test;
