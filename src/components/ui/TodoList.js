import React, { Component } from 'react';
import Info from './Info';
import Header from './Header';
import Footer from './Footer';
import FilteredList from './FilteredList';
import { applyFilter, search, FILTER_ACTIVE } from '../../services/filter';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'dueDate',
      sortOrder: 'asc',
      taskToEdit: null,  // Track the task being edited
      newPriority: '',    // Track the new priority value
      newDueDate: ''      // Track the new due date value
    };
  }

  handleSortChange = (sortBy, sortOrder) => {
    this.setState({ sortBy, sortOrder });
  };

  handleEditTask = (task) => {
    this.setState({
      taskToEdit: task,
      newPriority: task.priority || '',
      newDueDate: task.dueDate || ''
    });
  };

  handleSaveTask = () => {
    const { taskToEdit, newPriority, newDueDate } = this.state;
    const { changeStatus } = this.props.actions;
    
    // Update the task details
    const updatedTask = {
      ...taskToEdit,
      priority: newPriority,
      dueDate: newDueDate
    };

    // Save the updated task (you can send an action here to update the task in the parent)
    changeStatus(updatedTask.id, updatedTask.completed);  // Assuming changeStatus is for updating task

    // Close the edit mode
    this.setState({ taskToEdit: null });
  };

  render() {
    const { list, filter, mode, query } = this.props.data;
    const { addNew, changeFilter, changeStatus, changeMode, setSearchQuery } = this.props.actions;
    const { sortBy, sortOrder, taskToEdit, newPriority, newDueDate } = this.state;

    // Sorting logic (unchanged)
    const sortedItems = [...list];

    // Sort by Due Date
    if (sortBy === 'dueDate') {
      sortedItems.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    // Sort by Priority (High > Medium > Low)
    if (sortBy === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      sortedItems.sort((a, b) => {
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }

    const activeItemCount = applyFilter(sortedItems, FILTER_ACTIVE).length;
    const items = search(applyFilter(sortedItems, filter), query);

    return (
      <div className="container">
        <div className="row">
          <div className="todolist">
            <Header
              {...{ addNew, mode, query, setSearchQuery, changeSort: this.handleSortChange }}
            />
            <FilteredList
              {...{ items, changeStatus, onEditTask: this.handleEditTask }}
            />
            {taskToEdit && (
              <div className="edit-task-form">
                <h3>Edit Task</h3>
                <form>
                  <label>
                    Priority:
                    <select
                      value={newPriority}
                      onChange={(e) => this.setState({ newPriority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </label>
                  <label>
                    Due Date:
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => this.setState({ newDueDate: e.target.value })}
                    />
                  </label>
                  <button type="button" onClick={this.handleSaveTask}>Save</button>
                  <button type="button" onClick={() => this.setState({ taskToEdit: null })}>Cancel</button>
                </form>
              </div>
            )}
            <Footer
              {...{ activeItemCount, filter, changeFilter, mode, changeMode }}
            />
            <Info {...{ mode }} />
          </div>
        </div>
      </div>
    );
  }
}

export default TodoList;