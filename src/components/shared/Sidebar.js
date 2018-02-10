import React from "react";
import { Link } from "react-router";

class Sidebar extends React.Component {
  render() {
    return (
      <div id="sidebar" className="sidebar">
        {" "}{/*background color light bootstrap line 361*/}
        <div className="sidebar-background" />
        <div className="logo">
          <img src="/images/aopaLOGO.png" alt="Logo" />
        </div>
        <div className="sidebar-wrapper">
          <h3 className="text-primary text-center">
            Welcome {this.props.profile && this.props.profile.fullname}
          </h3>
          <h5 className="text-muted text-center">
            My Monthly No. Test:{" "}
            {this.props.stats && this.props.stats.totalUserTests}
          </h5>
          <h5 className="text-muted text-center">
            Clinitians' No. Of Test Monthly:{" "}
            {this.props.stats && this.props.stats.totalTests}
          </h5>
          <ul className="nav">
            <li className>
              <Link
                activeClassName="active"
                className="nav-link"
                to="/createform"
              >
                <i className="glyphicon glyphicon-plus text-muted" />
                <p>Create a New Report</p>
              </Link>
            </li>
            <li className>
              <Link
                activeClassName="active"
                className="nav-link"
                to="/dashboard"
              >
                <i className="pe-7s-note2" />
                <p>Pending Reports</p>
              </Link>
            </li>
            <li className>
              <Link
                activeClassName="active"
                className="nav-link"
                to="/viewrecords"
              >
                <i className="pe-7s-news-paper" />
                <p>Completed Reports</p>
              </Link>
            </li>
            <li className>
              <Link
                activeClassName="active"
                className="nav-link"
                to="/settings"
              >
                <i className="pe-7s-science" />
                <p>PDF Settings</p>
              </Link>
            </li>
            <li className />
            <li className="active">
              <Link activeClassName="active" className="nav-link" to="/profile">
                <i className="pe-7s-user" />
                <p>My Profile</p>
              </Link>
            </li>
            <li role="presentation" className>
              <Link to="/logout" role="button">
                <i className="glyphicon glyphicon-off" />
                <p>Logout</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
