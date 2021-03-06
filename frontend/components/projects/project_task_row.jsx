import React from 'react';
import TaskContextMenu from '../main/task_context_menu';

class ProjectTaskRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.task.name,
      description: props.task.description,
      dueDate: props.task.dueDate,
      // showContextMenu: false
      // done: props.task.done,
      // projectId: props.task.projectId
    }

    // this.contextMenuRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.toggleCheck = this.toggleCheck.bind(this);
    // this.openContextMenu = this.openContextMenu.bind(this);
    // this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  // componentDidMount() {
  //   let that = this;
  //   document.addEventListener("mousedown", that.handleClickOutside, false);
  // }

  // componentWillUnmount() {
  //   let that = this;
  //   document.removeEventListener("mousedown", that.handleClickOutside, false);
  // }

  // For Context Menu
  // handleClickOutside(evt) {
  //   // debugger
  //   if (evt.relatedTarget === null || (this.contextMenuRef && this.contextMenuRef.current &&
  //     !this.contextMenuRef.contains(evt.relatedTarget))) {
  //       // debugger
  //       this.setState({ showContextMenu: false });
  //   }
  // }

  toggleCheck() {
    this.props.updateTask({ id: this.props.task.id, done: !this.props.task.done });
  }

  handleKeyDown(evt) {
    if (evt.key === "Enter" || evt.keyCode === 13) {
      evt.preventDefault();
      evt.target.blur();
    }
  }

  handleChange(field) {
    return (evt) => {
      this.setState({ [field]: evt.target.value });
    };
  }

  handleUpdate(field) {
    return (evt) => {
      let updatedValue = evt.target.value;
      if (field === 'name') {
        // Replace all leading spaces or tab/newline chars
        updatedValue = updatedValue.replace(/^ +|[\r\n\v\t]+/g, '');
        if (updatedValue === '') {
          updatedValue = 'Untitled Task';
        }
      }
      if (updatedValue !== this.props.task[field]) {
        this.props.updateTask({ id: this.props.task.id, [field]: updatedValue });
      } else {
        this.setState({ [field]: updatedValue });
      }
    };
  }

  dueDateColorClass(date) {
    let todayDate = new Date().toISOString().substr(0, 10); // to avoid closure
    let dateDifference = new Date(date) - new Date(todayDate); // positive if date is ahead of today
    let daysAway = (dateDifference / 86400000);

    if (daysAway < 0) {
      return " date-past-due"; // Corresponds to red/$secondary color
    } else if (daysAway > 1) {
      return ""; // No need to change color
    } else {
      return " date-today-tomorrow"; // Corresponds to green/$primary color
    }
  };

  // openContextMenu(evt) {
  //   evt.preventDefault();
  //   this.setState({ showContextMenu: true });
  // }

  render() {
    const { task, destroyTask } = this.props;
    const { name, description, dueDate, showContextMenu } = this.state;

    return (
      <div className="project-task-row" >
        <button className={"plus-button rotated-plus"} type="button" onClick={() => destroyTask(task.id)} />
        <div className="task-check-wrapper">
          <button className={`project-task-check${task.done ? " task-done" : ""}`} type="button"
            onClick={this.toggleCheck}
          />
        </div>
        <input className={`project-task-input task-input${task.done ? " task-done" : ""}`} type="text"
          value={name}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange("name")}
          onBlur={this.handleUpdate("name")}
          autoComplete="off" autoCorrect="off" autoCapitalize="off"
          spellCheck="false"
        />
        <input className={`project-task-input task-input`} type="text"
          value={description}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange("description")}
          onBlur={this.handleUpdate("description")}
          placeholder="Add Task Description..."
          autoComplete="off" autoCorrect="off" autoCapitalize="off"
          spellCheck="false"
        />
        {task.dueDate ?
          <input className={"my-tasks-date" + this.dueDateColorClass(task.dueDate)} type="date"
            defaultValue={task.dueDate} onChange={this.handleUpdate("dueDate")} />
          : <input className={"my-tasks-date" + " date-empty"} type="date" onChange={this.handleUpdate("dueDate")} />
        }
        {/* {showContextMenu &&
          <TaskContextMenu contextMenuRef={el => this.contextMenuRef = el} task={task} />
        } */}
      </div>
    )
  }
}

export default ProjectTaskRow;