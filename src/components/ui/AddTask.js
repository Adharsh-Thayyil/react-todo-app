import React, { useState, useEffect } from "react";

const AddTask = ({ onAddTask, taskToEdit, onEditTask }) => {
  // States for task input, priority, and due date
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  // If editing a task, pre-fill the form with the task details
  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit.text);
      setPriority(taskToEdit.priority || "Low");
      setDueDate(taskToEdit.dueDate || "");
    }
  }, [taskToEdit]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Only proceed if the task name is not empty
    if (task.trim()) {
      const newTask = { text: task, priority, dueDate };

      // If editing a task, call the edit handler
      if (taskToEdit) {
        onEditTask(taskToEdit.id, newTask);
      } else {
        // If adding a new task, call the add handler
        onAddTask(newTask);
      }

      // Reset form fields after submission
      setTask("");
      setPriority("Low");
      setDueDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a task"
        required
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">{taskToEdit ? "Edit Task" : "Add Task"}</button>
    </form>
  );
};

export default AddTask;