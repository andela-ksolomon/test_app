import React from "react";
import firebase from "firebase";
import { connect } from "react-redux";

class Profile extends React.Component {
  state = {
    profile: {
      hospitalid: "",
      fullname: "",
      clinic: "",
      zip: "",
      email: "",
      city: "",
      state: "",
      streetaddress: ""
    },
    successMessage: ""
  };

  componentDidMount() {
    this.setState({
      profile: {
        ...this.state.profile,
        ...this.props.profile
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile) {
      this.setState({
        profile: {
          ...this.state.profile,
          ...nextProps.profile
        }
      });
    }
  }

  onInputChange(name, event) {
    const { profile } = this.state;
    profile[name] = event.target.value;
    this.setState({
      profile
    });
  }

  updateProfile() {
    const { profile } = this.state;
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref()
      .child(`/users/${userId}`)
      .update(profile)
      .then(() => {
        this.setState({
          successMessage: `Profile was updated successfully`
        });
      });
  }

  render() {
    const { profile } = this.state;
    return (
      <div className="records col-xs-10">
        {profile &&
          <div className="container card">
            <div className="row">
              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-0 col-lg-offset-0 toppad">
                <div className="panel">
                  <div className="panel-heading">
                    <h3 className="panel-title">Profile Page</h3>
                  </div>
                  <div className="panel-body">
                    {this.state.successMessage &&
                      <div className="alert alert-success">
                        {this.state.successMessage}
                      </div>}
                    <div className="row">
                      <div className=" col-md-12 col-lg-12 ">
                        <table className="table table-user-information">
                          <tbody>
                            <tr>
                              <td>AOPA Member ID</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={profile.hospitalid}
                                  placeholder="AOPA Member ID"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "hospitalid"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Clinician Name</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={profile.fullname}
                                  placeholder="Clinician Name"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "fullname"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Email</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={profile.email}
                                  placeholder="Email Address"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "email"
                                  )}
                                />
                              </td>
                            </tr>
                            <button
                              onClick={this.updateProfile.bind(this)}
                              className="btn btn-fill btn-info"
                            >
                              <span className="glyphicon glyphicon-edit" />{" "}
                              Update Profile
                            </button>
                          </tbody>
                        </table>
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
  profile: state.auth.profile
}))(Profile);
