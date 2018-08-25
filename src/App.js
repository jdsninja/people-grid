import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import get from 'lodash.get';
import classnames from 'classnames';
import logo from './logo.svg';
import './App.css';
import users from './data';
import { SORT_TYPE } from './constants';

/*
Sorts - chosen from a select.
○ Featured - the default sort (no sort)
○ A-Z: Alphabetically ascending by name 
○ Priority: Listed in ascending order
● Filters - chosen by radio buttons for each type of filter. When a filter is selected, only the matching people are displayed. The non-matching should not be rendered.
○ Category - show the unique categories present in the initial set of data. Do not hardcode this.
*/

class App extends Component {
  state = {
    users: null,
    categories: null,
    selectedFilter: null,
    selectedSort: null,
  }

  componentWillMount() {
    this.setState({ users, alteredUsers: users })
    this.setCategories(users)
  }

  sortBy = (users) => {
    const { selectedSort } = this.state;
    if (selectedSort === SORT_TYPE.AZ) {
      return [...users].sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      });
    }
    if (selectedSort === SORT_TYPE.PRIORITY) {
      return [...users].sort((a, b) => {
        let priorityA = a.priority;
        let priorityB = b.priority;
        return (priorityA < priorityB) ? -1 : (priorityA > priorityB) ? 1 : 0;
      });
    }
    return users;
  }

  filterBy = (users) => {
    const { selectedFilter } = this.state;
    if (!selectedFilter) {
      return users;
    }
    return users.filter(x => x.category === selectedFilter)
  }

  setCategories = (users) => {
    const categories = users.reduce((accumulator, currentValue) => {
      if (accumulator.includes(currentValue.category)) {
        return accumulator;
      }
      return [...accumulator, currentValue.category];
    }, []).sort();
    this.setState({ categories })
  }

  render() {
    const { users, categories } = this.state;

    const alteredUsers = this.sortBy(this.filterBy(users));

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Users grid</h1>
        </header>
        <div>
          Sort by
          <select onChange={(e) => this.setState({ selectedSort: e.currentTarget.value })}>
            <option value="featured">Featured</option>
            <option value="alphabetically">A-Z</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div>
          Filter by
          {categories.map(x => {
            return (
              <label>
                <input
                  name="category"
                  type="radio"
                  value={x}
                  onChange={(e) => this.setState({ selectedFilter: e.currentTarget.value })}
                />
                {x}
              </label>
            );
          })}
        </div>
        <Row>
          {alteredUsers.map((user) => {
            return (
              <Col
                xs={4}
                className={classnames(`card priority_${get(user, 'priority')}`)}
              >
                <h2>{get(user, 'name')}</h2>
                <div className="age">{get(user, 'age')}</div>
                <div className="category">{get(user, 'category')}</div>
              </Col>
            )
          })}
        </Row>
      </div>
    );
  }
}

export default App;
