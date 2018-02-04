import React from "react";
import { Link } from "react-router";

//NAVBAR HAS BEEN OMMITED
//NAVBAR HAS BEEN OMMITED
//NAVBAR HAS BEEN OMMITED
//NAVBAR HAS BEEN OMMITED
//NAVBAR HAS BEEN OMMITED

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-collapse collapse">
            <div>
              <ul className="nav navbar-nav navbar-right">
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
