import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import firebase, { Promise } from 'firebase';
import { push } from 'react-router-redux';
import { resetNext } from '../../actions/auth';
// import { Link } from 'react-router';


class CreateForm extends React.Component {
  state =  {
    id: '',
    fullname: '',
    gender: '',
    age: '',
    race: '',
    weight: '',
    feet: '',
    inch: '',
    side: '',
    loading: false,
    allRace: ['Caucasian', 'Mongoloid', 'Negroid', 'Australoid']
  }
  /*
	* Handles Form Submission
	*/
  handleSubmit(event) {
    this.setState({
      loading: true
    })
    event.preventDefault();
    const postData = {
      id: this.state.id,
      fullname: this.state.fullname,
      gender: this.state.gender,
      age: this.state.age,
      race: this.state.race,
      weight: this.state.weight,
      height: `${this.state.feet}ft/${this.state.inch}inch`,
      side: this.state.side,
      completed: 0,
      date: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    const userId = firebase.auth().currentUser.uid;
    let updates = {};
    updates[`/forms/${userId}/${postData['id']}`] = postData;
    firebase.database().ref().update(updates)
      .then(() => this.setState({
        loading: false
      }, () => {
        this.props.onRedirect(`/test/${postData['id']}`);
        this.props.onResetNext();
      }))
    .catch((error) => {
      this.setState({ error: error.message });
    });
  }
  selectRace (race) {
    this.setState({
      race
    })
  }
  /*
	* Validates Form before Submission
	*/
  validateForm = (data) => {
    const newFormKey = firebase.database().ref().child('forms').push().key;
    return new Promise((resolve, reject) => {
      resolve(newFormKey);
    })
  }
  /*
	* Handles Input Changes
	*/
	onInputChange(name, event) {
    var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}

	render() {
    const { id, gender, age, race,
      weight, feet, inch, side} = this.state;
    const isEnabled =
      id.length > 0 && gender.length > 0 && age.length > 0 &&
      race.length > 0 && weight.length > 0 && feet.length > 0 && inch.length > 0 && side.length > 0;
		return (
			<div id="wrapper">
        <br />
				<div className="container">
          <div className="panel-heading well">  <h4 >Personal Information</h4></div>
          <div className="col-lg-12 well">
              <div className="row">
              <form onSubmit={this.handleSubmit.bind(this)} >
                  <div className="col-sm-12">
                  <div className="row">
                      <div className="col-sm-12 form-group">
                      <label>ID</label>
                      <input
                        type="text"
                        placeholder="Enter ID Here.."
                        className="form-control"
                        value={this.state.id}
                        onChange={this.onInputChange.bind(this, 'id')}
                      />
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-sm-12 form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter Full Name Here.."
                        className="form-control"
                        value={this.state.fullname}
                        onChange={this.onInputChange.bind(this, 'fullname')}
                      />
                      </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 form-group">
                      <label>Gender   </label>
                      <div className="form-group has-feedback">
                        <label className="input-group">
                        <span className="input-group-addon">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            onChange={this.onInputChange.bind(this, 'gender')}
                            checked={this.state.gender === 'Male'}
                          />
                          </span>
                          <div className="form-control form-control-static">
                           Male
                          </div>
                          <span className="glyphicon form-control-feedback "></span>
                        </label>
                      </div>
                      <div className="form-group has-feedback">
                        <label className="input-group">
                        <span className="input-group-addon">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            onChange={this.onInputChange.bind(this, 'gender')}
                            checked={this.state.gender === 'Female'}
                          />
                          </span>
                          <div className="form-control form-control-static">
                           Female
                          </div>
                          <span className="glyphicon form-control-feedback "></span>
                        </label>
                        </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 input-group">
                      <label>Age</label>
                      <div className="input-group">
                        <input
                          type="number"
                          placeholder="Enter Age Here.."
                          className="form-control"
                          value={this.state.age}
                          aria-describedby="age"
                          onChange={this.onInputChange.bind(this, 'age')}
                        />
                        <span
                          className="input-group-addon"
                          id="age">years</span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                      <div className="col-sm-2 form-group">
                        <label>Race</label>
                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.race || 'Select a Race'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.allRace.map((race, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectRace.bind(this, race)}> {race} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>  
                      <div className="col-sm-5 form-group">
                        <label>Weight</label>
                        <div className="col-sm-12 input-group">
                          <input
                            type="number"
                            placeholder="Enter Weight Here.."
                            className="form-control"
                            value={this.state.weight}
                            onChange={this.onInputChange.bind(this, 'weight')}
                          />
                          <span
                            className="input-group-addon"
                            id="age">pounds</span>
                        </div>
                      </div>
                      <div className="col-sm-5 form-group">
                      <label>Height</label>
                      <div className="row">
                        <div className="col-md-6">
                          <input
                            type="number"
                            placeholder="Feet.."
                            className="form-control"
                            value={this.state.feet}
                            onChange={this.onInputChange.bind(this, 'feet')}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="number"
                            placeholder="Inch.."
                            className="form-control"
                            value={this.state.inch}
                            onChange={this.onInputChange.bind(this, 'inch')}
                          />
                        </div>
                      </div>
                      </div>    
                  </div>
                  <div className="form-group">
                  <label>Level</label>
                      <div className="row">
                      <div className="col-md-1"></div>
                      <div className="col-md-6 offset-md-1">
                          <label>Side</label>
                          <div className="radio">
                            <label>
                              <input
                                type="radio"
                                name="side"
                                value="Right"
                                onChange={this.onInputChange.bind(this, 'side')}
                                checked={this.state.side === 'Right'}
                              />Right
                            </label>
                          </div>
                          <div className="radio">
                            <label>
                              <input
                                type="radio"
                                name="side"
                                value="Left"
                                onChange={this.onInputChange.bind(this, 'side')}
                                checked={this.state.side === 'Left'}
                              />Left
                            </label>
                          </div>
                          <div className="radio disabled">
                            <label>
                              <input
                                type="radio"
                                name="side"
                                value="Both"
                                onChange={this.onInputChange.bind(this, 'side')}
                                checked={this.state.side === 'Both'}
                              />Both
                            </label>
                          </div>
                      </div>
                      </div>
                  </div>
                  {this.state.loading && <div className="loader"></div>}
                  {!isEnabled && <div className="col-xs-6 alert alert-danger">All fields are required</div>}
                  <button disabled={!isEnabled} type="submit" className="btn btn btn-info pull-right">Continue</button>
                  </div>
              </form> 
              </div>
          </div>
          </div>
			</div>
		)
	}
}

export default connect(null, dispatch => ({
	onRedirect: (path) => {
		dispatch(push(path));
	},
	onResetNext: () => {
		dispatch(resetNext());
	},
}))(CreateForm);
