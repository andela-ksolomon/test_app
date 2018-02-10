import React from "react";
import firebase from "firebase";
import { connect } from "react-redux";

class Settings extends React.Component {
  state = {
    settings: {
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
      settings: {
        ...this.state.settings,
        ...this.props.settings
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settings) {
      this.setState({
        settings: {
          ...this.state.settings,
          ...nextProps.settings
        }
      });
    }
  }

  onInputChange(name, event) {
    const { settings } = this.state;
    settings[name] = event.target.value;
    this.setState({
      settings
    });
  }

  updateSettings() {
    const { settings } = this.state;
    const userId = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref()
      .child(`/users/${userId}`)
      .update(settings)
      .then(() => {
        this.setState({
          successMessage: `Settings was updated successfully`
        });
      });
  }

  render() {
    const { settings } = this.state;
    return (
      <div className="records col-xs-10">
        {settings &&
          <div className="container card">
            <div className="row">
              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-0 col-lg-offset-0 toppad">
                <div className="panel">
                  <div className="panel-heading">
                    <h3 className="panel-title">Settings Page</h3>
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
                              <td>Clinic Name</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={settings.clinic}
                                  placeholder="Clinic Name"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "clinic"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Clinic Address</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={settings.streetaddress}
                                  placeholder="Street Address"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "streetaddress"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>City</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={settings.city}
                                  placeholder="City"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "city"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>State</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={settings.state}
                                  placeholder="State"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "state"
                                  )}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>ZIP Code</td>
                              <td>
                                <input
                                  className="form-control"
                                  type="text"
                                  value={settings.zip}
                                  placeholder="Zip Code"
                                  onChange={this.onInputChange.bind(
                                    this,
                                    "zip"
                                  )}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <button
                          onClick={this.updateSettings.bind(this)}
                          className="btn btn-fill btn-info"
                        >
                          <span className="glyphicon glyphicon-edit" /> Update
                          Settings
                        </button>
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
  settings: state.auth.profile
}))(Settings);
