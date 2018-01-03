import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router';

class ViewRecords extends React.Component {
  state = {
    forms: [],
    isFound: 'loading',
    alert: null
  }
  componentWillMount() {
    if (this.props.forms) {
      let allForms = [];
      Object.keys(this.props.forms).forEach((id) => {
        allForms.push(this.props.forms[id])
      })
      if (allForms.length > 0) {
        this.setState({
          isFound: 'yes',
          forms: allForms
        })
      } else {
        this.setState({
          isFound: 'no'
        })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps);
  }

  onDelete (form) {
    const getAlert = (form) => (
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
        You will not be able to recover this form!
        </SweetAlert>
    );

    this.setState({
      alert: getAlert(form)
    });
  }

  deleteForm (form) {
    console.log(form, 'form');
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`/forms/${userId}/${form.id}`).remove();
     this.setState({
        alert: null
      });
  }

  onCancelDelete () {
    this.setState({
      alert: null
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forms) {
        let allForms = [];
        Object.keys(nextProps.forms).forEach((id) => {
          allForms.push(nextProps.forms[id])
        })
        if (allForms.length > 0) {
          this.setState({
            isFound: 'yes',
            forms: allForms
          })
        } else {
          this.setState({
            isFound: 'no'
          })
        }
    }
  }
	render() {
    const {
      forms,
      isFound
    } = this.state;
    const completedForm = forms.filter((form) => form.completed === 1);
		return (
			<div id="wrapper">
      {this.state.alert}
        {isFound === 'loading' && <div id="loader"></div>}
			    <div className="records col-md-8">
            <div className="panel panel-default list-group-panel">
                <div className="panel-body">
                    <ul className="list-group list-group-header">
                        <li className="list-group-item list-group-body">
                            <div className="row">
                                <div className="col-xs-6 text-left"><h4>Completed Form</h4></div>
                                <div className="col-xs-3 col-xs-offset-3">
                                <Link className="btn icon-btn btn-success" href="/createform">
                                <span className="glyphicon btn-glyphicon glyphicon-plus img-circle text-success"></span>
                                Create a New Form
                                </Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                    {isFound === 'no' && <div className="well"><h3> You don't any completed form yet!</h3></div>}
                    {isFound === 'yes' && completedForm.length === 0 && <div className="well"><h3> You don't any completed form yet!</h3></div>}
                    {forms && completedForm.length > 0 && <ul className="list-group list-group-body">
                        {completedForm.map((form, i) => (
                          <li className="list-group-item" key={i}>
                            <div className="row" id="row">
                                <div className="col-xs-6 text-left" id="marginTop">
                                  <a>
                                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                                    {form.fullname}
                                  </a>
                                  <p id="form_id">ID: {form.id}</p>
                                </div>
                                <div className="col-xs-4 col-xs-offset-2">
                                <Link to={'/test/' + form.id} className="btn icon-btn btn-primary video">
                                    <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success"></span>
                                    View Form
                                    </Link>
                                <a onClick={this.onDelete.bind(this, form)} className="btn icon-btn btn-danger">
                                    <span className="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger"></span>
                                    Delete
                                </a>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </div>
    </div>
		)
	}
}

export default connect(state  => ({
    forms: state.form.forms
}))(ViewRecords);
