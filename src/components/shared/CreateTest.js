import React from 'react';
import firebase from 'firebase';
import moment from 'moment';
import QuizComponent from './QuizComponent';
// import { connect } from 'react-redux';
// import { Link } from 'react-router';

class CreateTest extends React.Component {
  state = {
    title: '',
    time: '',
    comment: '',
    error: '',
    successMessage: '',
    selectedTest: '',
    selectedCategory: '',
    allQuestions: {},
    videos: {
      'L TEST': '//www.youtube.com/embed/gixqOS8qBNA?rel=0',
      'TUG TEST': '//www.youtube.com/embed/VljdYRXMIE8?rel=0'
    }
  }
  styles = {
		row: {
			'padding': 25
    },
    metric: {
      maxHeight: 500,
      'overflow': 'scroll',
      padding: 25
    }
  };

  componentWillReceiveProps (nextProps) {
    let tests;
    if (nextProps.selectedCategory && nextProps.tests) {
      if(nextProps.tests.hasOwnProperty(nextProps.selectedCategory)) {
        tests = nextProps.tests[nextProps.selectedCategory];
      }
    }
    if(tests) {
      const testData = tests[nextProps.selectedTest];
      if (testData) {
        this.setState({
          title: testData.title,
          time: testData.time,
          comment: testData.comment,
          selectedCategory: testData.category,
          date: testData.date,
          successMessage: '',
          selectedTest: nextProps.selectedTest,
          allQuestions: testData.questions
        })
      } else {
        if (nextProps.selectedCategory) {
          this.setState({
            title: '',
            time: '',
            comment: '',
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            selectedCategory: nextProps.selectedCategory,
            successMessage: '',
            selectedTest: nextProps.selectedTest,
            allQuestions: Object.assign({}, nextProps.questions)
          })
        }
      }
    } else {
      this.setState({
        title: '',
        time: '',
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        comment: '',
        successMessage: '',
        selectedCategory: nextProps.selectedCategory,
        selectedTest: nextProps.selectedTest,
        allQuestions: Object.assign({}, nextProps.questions)
      })
    }
  }

  saveMetric (event) {
    event.preventDefault();
    this.setState({
      error: ''
    })
    const {
      valid,
      error
    } = this.isValid();

    if(valid) {
      const userId = firebase.auth().currentUser.uid;
      let updates = {};
      const testkey = this.state.selectedTest || firebase.database().ref()
        .child(`forms/${userId}/${this.props.formId}/tests`).push().key
      const postData = this.state.selectedCategory !== 'PEQ TEST' ? {
        id: testkey,
        formId: this.props.formId,
        category: this.state.selectedCategory,
        time: this.state.time,
        comment: this.state.comment,
        title: this.state.title,
        date: this.state.date
      } : {
        id: testkey,
        formId: this.props.formId,
        category: this.state.selectedCategory,
        questions: this.state.allQuestions,
        comment: this.state.comment,
        title: this.state.title,
        date: this.state.date
      }
      updates[`/forms/${userId}/${this.props.formId}/
      tests/${this.state.selectedCategory}/${testkey}`] = postData;
      firebase.database().ref().update(updates)
      .then(() => {
        this.props.resetValue(testkey, this.state.selectedCategory);
        this.setState({
          successMessage: 'Test was saved sucessfully'
        }, () => setTimeout(() => {
          this.setState({
            successMessage: ''
          })
        }, 2000))
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
    } else {
      this.setState({
        error
      })
    }
  }

  isValid () {
    let valid = true;
    let error = '';
    if(!this.state.title) {
      valid = false;
      error = 'Title is required to save form'
      return {
        valid,
        error
      }
    }
    const {
      allQuestions
    } = this.state;
    if(this.state.selectedCategory === 'PEQ TEST') {
      Object.keys(allQuestions).forEach((category) => {
        const filteredQuestions =  allQuestions[category]
          .filter(question => question.value)
            valid = filteredQuestions.length > 0 ? true : false;
            error = 'You must answer atleast one question from each section'
            return;
          })
       return {
        valid,
        error
      }
    } else {
      if(!this.state.time) {
        valid = false;
        error = 'Time value is required to save test data'
        return {
          valid,
          error
        }
      }
    }
    return {
      valid,
      error
    }
  }

  onInputChange(name, event) {
		var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}
	render() {
    var errors = this.state.error ? <p> {this.state.error} </p> : '';
		return (
      <div className="modal fade" id="videoModal" tabIndex="-1"
        role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
        <button type="button" className="close btn btn-danger"
          data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span></button>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-5">
            <h3 className="form-text text-muted">{this.state.title}</h3></div>
          <div className="col-md-10 col-sm-offset-1 well">
            <div className="form-group">
              {errors && <div className="alert alert-danger">{errors}</div>}
              {this.state.successMessage &&
              <div className="alert alert-success">
                {this.state.successMessage}
              </div>}
              <label htmlFor="exampleInputEmail1">Title</label>
              <input
                id="exampleInputtitle1"
                name="title"
                type="text"
                placeholder='Enter Title'
                className="form-control input-md"
                value={this.state.title}
                onChange={this.onInputChange.bind(this, 'title')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <span>   {this.state.selectedCategory}</span>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <span>   {this.state.date}</span>
            </div>
            {this.state.selectedCategory === 'PEQ TEST' &&
              <QuizComponent allQuestions={this.state.allQuestions} />}
            {this.state.selectedCategory !== 'PEQ TEST' &&
              <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Scale Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Time</td>
                  <td>
                    <input
                      id="textinput"
                      name="textinput"
                      type="text"
                      placeholder='Time in Seconds'
                      className="form-control input-md"
                      value={this.state.time}
                      onChange={this.onInputChange.bind(this, 'time')}
                    />
                  </td>
                </tr>
              </tbody>
            </table>}
            <form style={ this.styles.metric } className="form-horizontal"
              onSubmit={this.saveMetric.bind(this)}>

              <div className="col-md-12 form-group">
                <textarea className="form-control" placeholder="Write a Comment"
                  id="textarea"
                  onChange={this.onInputChange.bind(this, 'comment')}
                  name="comment" value={this.state.comment}
                />
              </div>
              <div className="col-xs-3 col-xs-offset-1 form-group">
                  <button type="submit" id="singlebutton"
                    name="singlebutton"
                    className="btn btn-success col-xs-12">Save</button>
              </div>
            </form>
            {this.state.selectedCategory !== 'PEQ TEST' && <div>
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button data-toggle="collapse" data-parent="#accordion"
                    href="#collapse1"
                    className="btn btn-primary pull-left left-arrow">+</button>
                  <h6 data-toggle="collapse" data-parent="#accordion"
                    href="#collapse1" className="panel-title">
                    <span className="accordion_heading">
                      Show Instructions
                    </span>
                  </h6>
                </div>
                <div id="collapse1" className="panel-collapse collapse">
                  <div className="panel-body">
                    <div id="carousel-example-generic"
                      className="carousel slide"
                      data-interval="false"
                      data-ride="carousel">
                      <div className="carousel-inner">
                        <div className="item active">
                          <div className="row" style={ this.styles.row }>
                            <p className="testimonial_para">
                              1Lorem Ipsum ist ein einfacher Demo-Text </p><br />
                          </div>
                        </div>
                        <div className="item" style={ this.styles.row }>
                          <div className="row">
                            <p className="testimonial_para">2Lorem Ipsum ist ein</p>
                            <br />
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="col-sm-9 col-sm-offset-5">
                      <a className="left fa fa-chevron-left btn btn-default testimonial_btn"
                        href="#carousel-example-generic"
                      data-slide="prev">
                      </a>
                      <a className="right fa fa-chevron-right btn btn-default testimonial_btn"
                        href="#carousel-example-generic"
                      data-slide="next">
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button data-toggle="collapse" data-parent="#accordion"
                    href="#collapse2"
                    className="btn btn-primary pull-left left-arrow">+</button>
                  <h6 data-toggle="collapse" data-parent="#accordion"
                    href="#collapse2" className="panel-title">
                    <span className="accordion_heading">Show Video</span>
                  </h6>
                </div>
                <div id="collapse2"
                  className="panel-collapse collapse videopadding">
                  <div className="panel-body">
                    <iframe id="video" width="720" height="350"
                      src={this.state.videos[this.state.selectedCategory]}
                      frameBorder="0" allowFullScreen></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>}
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
    )
	}
}

export default CreateTest;