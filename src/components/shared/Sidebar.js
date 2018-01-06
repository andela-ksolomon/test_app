import React from 'react';
import { Link } from 'react-router';

class Sidebar extends React.Component {
  render() {
    return (
      <div className="profile-sidebar">
        <div className="profile-userpic">
          <img src="https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg" className="img-responsive" alt="" />
        </div>
        <div className="profile-usertitle">
          <div className="profile-usertitle-name">
            {this.props.user && this.props.user.displayName}
          </div>
          <div className="profile-usertitle-email">
            {this.props.user && this.props.user.email}
          </div>
        </div>
        <div className="profile-userbuttons">
          <Link to="/profile"><button type="button" className="btn btn-info btn-sm">My Profile</button></Link>
          <Link to="/logout"><button type="button" className="btn btn-danger btn-sm">Logout</button></Link>
        </div>
        <div className="profile-usermenu">
        <ul className="nav">
            <li>
              <span>
                No of Tests Created: {this.props.stats && this.props.stats.totalUserTests}
              </span>
            </li>
            <li>
              <span>
                Total Tests: {this.props.stats && this.props.stats.totalTests}
              </span>
            </li>
          </ul>
        </div>
        <div className="profile-usermenu">
          <ul className="nav">
            <li>
              <Link activeClassName="active" to="/createform">
              <i className="glyphicon glyphicon-plus"></i>
              Create a new form </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/dashboard">
              <i className="glyphicon glyphicon-hourglass"></i>
              Pending Forms </Link>
            </li>
            <li>
              <Link activeClassName="active" to="/viewrecords">
              <i className="glyphicon glyphicon-ok"></i>
              View Completed Forms </Link>
            </li>
            {/* <li>
              <Link activeClassName="active" to="#">
              <i className="glyphicon glyphicon-flag"></i>
              Help </Link>
            </li> */}
          </ul>
        </div>
        </div>
    )
  }
}

export default Sidebar;
