import React from 'react';
import CheckBox from './CheckBox';

export default function TodoItem(props) {
    const { data, changeStatus, onEdit } = props;

    const handleChange = (checked) => {
        if (checked) {
            const confirmCompletion = window.confirm("Are you sure you want to mark this task as completed?");
            if (confirmCompletion) {
                changeStatus(data.id, true);
            } else {
                changeStatus(data.id, false);
            }
        } else {
            changeStatus(data.id, false);
        }
    };

    // Format the dueDate as a string (if it's a valid date)
    const formattedDueDate = data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'No Due Date';
    const className = 'todo-item ui-state-default ' + (data.completed === true ? 'completed' : 'pending');

    return (
        <li className={className}>
            <div className="checkbox">
                <label>
                    <CheckBox checked={data.completed} onChange={handleChange} /> {data.text}
                </label>
                <span className="priority">Priority: {data.priority || 'Low'}</span>
                <span className="due-date">Due: {formattedDueDate}</span> {/* Use formatted date */}
                <button onClick={() => onEdit(data)}>Edit</button> {/* Edit button */}
            </div>
        </li>
    );
}