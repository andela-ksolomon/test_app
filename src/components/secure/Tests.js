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
    if (this.props.forms && this.props.forms[this.props.routeParams.id]) {
      this.setState({
        isFound: "yes",
        formValue: this.props.forms[this.props.routeParams.id]
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.forms) {
      if (nextProps.forms[this.props.routeParams.id]) {
        this.setState({
          isFound: "yes",
          formValue: nextProps.forms[this.props.routeParams.id]
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
    return (
      <div>
        <br />
        <br />
        {isFound === "loading" && <div id="loader" />}
        {isFound === "yes" &&
          <div className="col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-0 col-lg-offset-0 " >
            <div className="container-fluid">
              <div className="row ">
                <div className="col-md-4">
                  <div className="card card-user" >
                    <div className="header">
                      <h4 className="title">Patient Information</h4>
                      <p className="category" />
                    </div>
                    <div className="content">
                      <p className="description text-left">
                        <h4>
                          <small>
                            Full Name: {formValue.fullname}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Id: {formValue.id}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Age: {formValue.age} Years
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Sex: {formValue.sex}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Height: {formValue.height}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Weight: {formValue.weight}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Race: {formValue.race}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Limb Loss Level: {formValue.limbLev}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Amputation Side: {formValue.ampSide}
                          </small>
                        </h4>
                      </p>
                      <hr />
                      <p className="description text-left">
                        <h4>
                          <small>
                            Cause of limb loss: {formValue.limbLost}
                          </small>
                        </h4>
                      </p>
                      <hr />
                    </div>
                    <hr />
                  </div>
                </div>
                <div className="col-md-8" >
                  <div className="card">
                    <div className="header">
                      {/*<h4>Outcome Tests History</h4> */}
                      <p className="category" />
                    </div>
                    <div
                      className="content"
                      style={{ maxHeight: 790, overflow: "scroll" }}
                    >
                      <Test
                        questions={this.props.questions}
                        formValue={formValue}
                        profile={this.props.profile}
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
