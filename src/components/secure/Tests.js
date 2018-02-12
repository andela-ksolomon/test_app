import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import Test from "../shared/Test";

class Tests extends React.Component {
  state = {
    isFound: "loading",
    formValue: {}
  };
  componentWillMount() {
    const forms = this.props.forms
      ? this.props.forms[this.props.params.status]
      : null;
    if (forms && forms[this.props.routeParams.id]) {
      this.setState({
        isFound: "yes",
        formValue: forms[this.props.routeParams.id]
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const forms = nextProps.forms
      ? nextProps.forms[nextProps.params.status]
      : null;
    if (forms) {
      if (forms[this.props.routeParams.id]) {
        this.setState({
          isFound: "yes",
          formValue: forms[this.props.routeParams.id]
        });
      } else {
        this.setState({
          isFound: "no"
        });
      }
    }
  }
  render() {
    const { isFound, formValue } = this.state;
    const { status } = this.props.params;
    return (
      <div>
        <br />
        <br />
        {isFound === "loading" && <div id="loader" />}
        {isFound === "yes" &&
          <div className="col-md-12 col-lg-12 col-xs-offset-0 col-sm-offset-0 col-md-offset-0 col-lg-offset-0 ">
            <div className="container-fluid">
              <div className="row ">
                <div className="col-md-4">
                  <div className="card card-user">
                    <div className="header">
                      <h4 className="title">Patient Information</h4>
                      <p className="category" />
                    </div>
                    <div className="content">
                      <p className="description text-left">
                        <small>
                          Full Name: {formValue.fullname}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Id: {formValue.id}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Age: {formValue.age} Years
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Sex: {formValue.sex}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Height: {formValue.height}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Weight: {formValue.weight}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Race: {formValue.race}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Limb Loss Level: {formValue.limbLev}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Amputation Side: {formValue.ampSide}
                        </small>
                      </p>
                      <p className="description text-left">
                        <small>
                          Cause of limb loss: {formValue.limbLost}
                        </small>
                      </p>
                      {status === "pendingform" &&
                        <Link to={`/form/${formValue.id}`}>
                          <button className="btn-fill btn-sm btn btn-primary">
                            <span className="glyphicon btn-glyphicon glyphicon-pencil img-circle text-primary" />
                            Edit Patient Information
                          </button>
                        </Link>}
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card">
                    <div className="header">
                      {/*<h4>Outcome Tests History</h4> */}
                      <p className="category" />
                    </div>
                    <div
                      className="content"
                      style={{
                        maxHeight: 790,
                        minHeight: 645,
                        overflow: "scroll"
                      }}
                    >
                      <Test
                        questions={this.props.questions}
                        formValue={formValue}
                        profile={this.props.profile}
                        status={this.props.params.status}
                      />
                      <div className="footer">
                        <div className="stats">
                          <i />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
  profile: state.auth.profile,
  forms: state.form.forms,
  questions: state.form.questions
}))(Tests);
