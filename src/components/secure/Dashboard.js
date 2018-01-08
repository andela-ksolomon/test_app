import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Dashboard extends React.Component {
  state = {
    forms: [],
    isFound: 'loading',
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
  componentWillReceiveProps(nextProps) {
    // if form exist as a prop set value to app state
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
    const noofTests = (tests) => {
      let sum = 0;
      if(tests && Object.keys(tests).length > 0) {
        Object.keys(tests).forEach((category) => {
          sum += Object.keys(tests[category]).length;
        })
      }
      return sum;
    }
    const pendingForm = forms.filter((form) => form.completed === 0);
		return (
			<div id="wrapper">
        {isFound === 'loading' && <div id="loader"></div>}
			    <div className="records col-xs-9">
            <div className="panel panel-default list-group-panel">
                <div className="panel-body">
                    <ul className="list-group list-group-header">
                        <li className="list-group-item list-group-body">
                            <div className="row">
                                <div className="col-xs-6 text-left"><h4>Pending Form</h4></div>
                                <div className="col-xs-3 col-xs-offset-3">
                                <Link to="/createform">
                                  <button className="btn icon-btn btn-success">
                                    <span className="glyphicon btn-glyphicon glyphicon-plus img-circle text-success"></span>
                                    Create a New Form
                                  </button>
                                </Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                    {isFound === 'no' && <div className="well"><h3> You don't any pending form yet!</h3></div>}
                    {isFound === 'yes' && pendingForm.length === 0 && <div className="well"><h3> You don't any pending form yet!</h3></div>}
                    {forms && pendingForm.length > 0 && <ul className="list-group list-group-body">
                      <div className="row">
                        <div className="col-xs-3 text-left" id="marginTop">
                            Full name
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          Created date
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          No. of tests
                        </div>
                      </div>
                        {pendingForm.map((form, i) => (
                          <li className="list-group-item" key={i}>
                            <div className="row" id="row">
                                <div className="col-xs-3 text-left" id="marginTop">
                                  <a>
                                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                                    {form.fullname}
                                  </a>
                                  <p id="form_id" >ID: {form.id}</p>
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  {form.date}
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  <span id="test-no">{noofTests(form.tests)}</span>
                                </div>
                                <div className="col-xs-3">
                                <Link className="btn icon-btn btn-success video" to={`/test/${form.id}`}>
                                    <span className="glyphicon btn-glyphicon glyphicon-save img-circle text-success"></span>
                                    Edit Form
                                    </Link>
                                <a className="btn icon-btn btn-danger" href="#">
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
}))(Dashboard);
