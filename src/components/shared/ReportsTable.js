import React, { Component } from "react";
import { Link } from "react-router";

import SortCaret from "./SortCaret";

export default class ReportsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sortBy(column) {}
  render() {
    const { data, onDelete, status, sortBy, direction } = this.props;
    const noofTests = tests => {
      let sum = 0;
      if (tests && Object.keys(tests).length > 0) {
        Object.keys(tests).forEach(category => {
          sum += Object.keys(tests[category]).length;
        });
      }
      return sum;
    };
    return (
      <div className="content table-full-width table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                ID
                <SortCaret
                  order={direction.id}
                  column="id"
                  sortFunction={sortBy}
                />
                <a />
              </th>
              <th>
                Patient
                <SortCaret
                  order={direction.fullname}
                  column="fullname"
                  sortFunction={sortBy}
                />
              </th>
              <th>
                Created Date
                <SortCaret
                  order={direction.date}
                  column="date"
                  sortFunction={sortBy}
                />
              </th>
              <th>No. of Tests</th>
              <th>
                <span id="action_text">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((form, i) =>
              <tr key={i}>
                <td>
                  {form.id}
                </td>
                <td>
                  {form.fullname}
                </td>
                <td>
                  {form.date}
                </td>
                <td>
                  <span id="test-no">
                    {noofTests(form.tests)}
                  </span>
                </td>
                <td>
                  <Link to={`/test/${status}/${form.completedKey}`}>
                    <button className="col-xs-offset-1 btn-fill btn btn-info">
                      <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-info" />
                      View Report
                    </button>
                  </Link>
                  <button
                    onClick={() => onDelete(form)}
                    className="btn-fill btn btn-danger"
                  >
                    <span className="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger" />
                    Delete Report
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="footer">
          <div className="stats">
            <i />
          </div>
        </div>
      </div>
    );
  }
}
