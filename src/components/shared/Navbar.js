import React from "react";
import { Link } from "react-router";

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="#pablo" className="navbar-brand">
              Outcome Assessment Reporting System
            </a>
            <button type="button" className="navbar-toggle collapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>
          <div className="navbar-collapse collapse">
            <div>
              <ul className="nav navbar-nav navbar-right">
                <li role="presentation" className>
                  <Link to="/profile" role="button">
                    My Profile
                  </Link>
                </li>
                <li role="presentation" className>
                  <Link to="/logout" role="button">
                    <i className="glyphicon glyphicon-off" /> Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
