import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import CreateTest from '../shared/CreateTest';
import PdfPreviewer from './PdfPreviewer';
import { Link } from 'react-router';

class Test extends React.Component {
    state = {
        allTestCategory: [
            'TUG TEST',
            'L TEST',
            'PEQ TEST',
        ],
        selectedTest: '',
        selectedCategory: '',
        successMessage: '',
        alert: null,
        downloadTest: {}
    }
    style = {
        addButton: {
            marginTop: 15,
            marginLeft: 150
        }
    }

    selectCategory (selectedCategory) {
      this.setState({
        selectedCategory
      })
    }

    editTest (test, selectedCategory) {
        this.setState({
            selectedTest: test,
            selectedCategory
        });
    }

    onDelete (test) {
      const getAlert = (test) => (
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
          </SweetAlert>
      );

      this.setState({
        alert: getAlert(test)
      });
    }

    downloadPdf(downloadTest) {
      this.setState({
        downloadTest
      });
    }

    deleteTest (test) {
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/forms/${userId}/${this.props.formValue.id}/tests/${test.category}/${test.id}`).remove();
       this.setState({
          alert: null
        });
    }

    onCancelDelete () {
      this.setState({
        alert: null
      })
    }

    finishTest (test) {
      const userId = firebase.auth().currentUser.uid;
      let updates = {};
      firebase.database().ref(`/forms/${userId}/${this.props.formValue.id}/tests/${test.category}/${test.id}`).update({
        completed: 1
      }).then(() => {
        this.setState({
          successMessage: 'Test has been marked as completed'
        })
      });
    }

    completeForm () {
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref(`/forms/${userId}/${this.props.formValue.id}`).update({
        completed: 1
      }).then(() => {
        this.setState({
          successMessage: `This Form has been marked as completed,
           you will no longer be able to add new test`
        })
      });
    }

    resetValue (selectedTest, selectedCategory) {
      this.setState({
        selectedTest,
        selectedCategory
      })
    }

    flattenData (data) {
      console.log(data, 'data');
      let result = [];
      Object.keys(data).forEach((category) => {
        Object.keys(data[category]).forEach((test) => {
          result.push(data[category][test]);
        });
      });
      return result;
    }

	render() {
        const allTests = this.props.formValue.tests ? this.flattenData(this.props.formValue.tests) : null;

		return (
            <div id="wrapper">
            {this.state.alert}
				<div className="records col-xs-12">
        {this.state.successMessage && <div className="alert alert-success">{this.state.successMessage}</div>}
                    <div className="panel panel-default list-group-panel">
                        <div className="panel-body">
                            <ul className="list-group list-group-header">
                                <li className="list-group-item list-group-body">
                                    <div className="row">
                                      <div className="panel-heading">
                                        <h3 className="panel-title">Tests History</h3>
                                      </div>
                                        {this.props.formValue.completed !== 1 && <div className="col-xs-5 text-left">
                                        <Link className="col-xs-7 btn icon-btn btn-success" onClick={this.completeForm.bind(this)}>
                                            <span className="glyphicon btn-glyphicon glyphicon-check img-circle text-success"></span>
                                            Mark as Completed
                                        </Link>
                                        </div>}
                                        {this.props.formValue.completed !== 1 && <div className="col-xs-7 pull-right">
                                            <div className="col-xs-3 form-group" style={ this.style.addButton }>
                                            <div className="input-group input-group-xs">
                                                <div className="input-group-btn">
                                                    <button type="button" className="btn btn-default" data-toggle="dropdown">{this.state.selectedCategory || 'Select a Test'} <span className="caret"></span></button>
                                                    <ul className="dropdown-menu pull-left" role="menu">
                                                        {this.state.allTestCategory.map((testCategory, i) => <li key={i}><a onClick={this.selectCategory.bind(this, testCategory)}> {testCategory} </a></li>)}
                                                    </ul>
                                                    <button disabled={!this.state.selectedCategory} onClick={this.editTest.bind(this, '', this.state.selectedCategory)} data-toggle="modal" data-target="#videoModal" className="btn btn-default" type="button"><span className="glyphicon glyphicon-plus"></span> Add new test</button>
                                                </div>
                                            </div>
                                            </div>
                                        </div>}
                                    </div>
                                </li>
                            </ul>
                            {allTests && allTests.length > 0 ? <table id="mytable" className="table testTable table-bordred table-striped col-xs-12">

                              <thead>
                                <th></th>
                                <th>Title</th>
                                <th></th>
                                <th>Category</th>
                                <th>Created Date</th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </thead>
                              <tbody>
                              {allTests && allTests.map((test, i) => <tr key={i}>
                                <td><span className="yellow glyphicon glyphicon-list-alt" aria-hidden="true" /></td>
                                <td><a>{test['title']}</a></td>
                                <td></td>
                                <td>{test['category']}</td>
                                <td>{moment(test['date'], "MMMM Do YYYY, h:mm:ss a").fromNow()}</td>
                                {!test['completed'] && this.props.formValue.completed !== 1 && <td><p><button onClick={this.editTest.bind(this, test['id'], test['category'])} data-toggle="modal" data-target="#videoModal" className="btn icon-btn btn-info"><span className="glyphicon glyphicon-pencil"></span>  Edit</button></p></td>}
                                <td><p><button onClick={this.onDelete.bind(this, test)} className="btn icon-btn btn-danger"><span className="glyphicon glyphicon-trash"></span>  Delete</button></p></td>
                                {test['completed'] || this.props.formValue.completed === 1 ? <td><p><button onClick={this.downloadPdf.bind(this, test)} className="btn btn-default" data-toggle="modal" data-target="#pdfModal" ><span className="glyphicon glyphicon-download"></span>  Download PDF</button></p></td> : <td><p><button onClick={this.finishTest.bind(this, test)} className="btn icon-btn btn-success"><span className="glyphicon glyphicon-ok"></span>  Finish</button></p></td>}
                              </tr>)}
                              </tbody>
                              </table> : <div className="well">
                                <h5>No test has been done yet!</h5>
                              </div>}
                        </div>
                    </div>
                </div>
              <CreateTest
                tests={this.props.formValue.tests}
                selectedTest={this.state.selectedTest}
                selectedCategory={this.state.selectedCategory}
                formId={this.props.formValue.id}
                resetValue={this.resetValue.bind(this)}
              />
                <PdfPreviewer test={this.state.downloadTest} formValue={this.props.formValue} />
            </div>
		)
	}
}

export default Test;
