import React from 'react';
import { Link } from 'react-router';

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  data-target="#navbar"
                  aria-expanded="false"
                  aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                <a className="navbar-brand" href="">Logo</a> </div>
              <div id="navbar" className="navbar-collapse collapse">
                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <Link to='/logout'>
                     <i className="glyphicon glyphicon-off"></i>  Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        )
    }
}

export default Navbar;
