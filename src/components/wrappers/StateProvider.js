import React, {Component} from 'react';
import {FILTER_ALL} from '../../services/filter';
import {MODE_CREATE, MODE_NONE} from '../../services/mode';
import {objectWithOnly, wrapChildrenWith} from '../../util/common';
import {getAll, addToList, updateStatus} from '../../services/todo';

class StateProvider extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            mode: MODE_CREATE,
            filter: FILTER_ALL,
            list: getAll(),
            sortBy: 'dueDate', 
            sortOrder:'asc',
            currentTask:null
        }
    }

    render() {
        let children = wrapChildrenWith(this.props.children, {
            data: this.state,
            actions: objectWithOnly(this, ['addNew', 'changeFilter', 'changeStatus', 'changeMode', 'setSearchQuery','changeSort', 'editTask'])
        });

        return <div>{children}</div>;
    }

    addNew(text, priority, dueDate) {
        const newTask = {
            text,
            completed: false,
            priority,
            dueDate: new Date(dueDate), // Store as Date object for sorting
            id: Date.now() // Generate unique ID based on timestamp
        };
        let updatedList = addToList(this.state.list, newTask);
        this.setState({ list: updatedList });
    }

    // Edit an existing task
    editTask(id, newText, newPriority, newDueDate) {
        let updatedList = this.state.list.map(task => {
            if (task.id === id) {
                return { ...task, text: newText, priority: newPriority, dueDate: new Date(newDueDate) };
            }
            return task;
        });
        this.setState({ list: updatedList, currentTask: null });
    }

    changeFilter(filter) {
        this.setState({filter});
    }

    changeStatus(itemId, completed) {
        const updatedList = updateStatus(this.state.list, itemId, completed);

        this.setState({list: updatedList});
    }

    changeMode(mode = MODE_NONE) {
        this.setState({mode});
    }

    setSearchQuery(text) {
        this.setState({query: text || ''});
    }
    changeSort(sortBy, sortOrder) {
        this.setState({sortBy, sortOrder});
    }
}

export default StateProvider;
