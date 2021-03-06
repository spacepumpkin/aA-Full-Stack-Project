import {
  RECEIVE_TASK,
  REMOVE_TASK,
  TOGGLE_DONE
} from "../../actions/task_actions";
import { RECEIVE_CURRENT_USER } from "../../actions/session_actions";
import {
  REMOVE_SECTION_TASKS,
  UPDATE_SECTION_TASKS,
} from "../../actions/section_actions";

const tasksReducer = function (oldState = {}, action) {
  Object.freeze(oldState);
  const newState = Object.assign({}, oldState);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return Object.assign(newState, action.payload.tasks);
    case RECEIVE_TASK:
      return Object.assign(newState, { [action.task.id]: action.task });
    case REMOVE_TASK:
      delete newState[action.task.id];
      return newState;
    case REMOVE_SECTION_TASKS:
      action.tasks.forEach(task => delete newState[task.id])
      return newState;
    case UPDATE_SECTION_TASKS:
      action.tasks.forEach(task => newState[task.id].sectionId = null)
      return newState;
    case TOGGLE_DONE:
      newState[action.task.id] = action.task;
      return newState;
    default:
      return oldState;
  }
}

export default tasksReducer;

// tasks: {
//   1: {
//     id: 1,
//     name: "",
//     description: "",
//     dueDate: "2020-10-21"
//     creatorId: 1,
//     projectId: 1,
//     order: 1,
//     sectionId: 1 // if null, put in default section
//   },
// }