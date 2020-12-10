import * as TaskApiUtil from "../util/task_api_util";
/*
  * createTask(task) -> RECEIVE_TASK
  * updateTask(task) -> RECEIVE_TASK
  * destroyTask(taskId) -> REMOVE_TASK
  * assignTask(userId, taskId) -> RECEIVE_USERS_TASK
  * unassignTask(userId, taskId) -> REMOVE_USERS_TASK
*/

// REGULAR ACTIONS --------------------------------------------------
export const RECEIVE_TASK = "RECEIVE_TASK"; // hits tasksReducer + usersTasksReducer
export const RECEIVE_TASK_ERRORS = "RECEIVE_TASK_ERRORS"; // hits tasksReducer + usersTasksReducer
export const REMOVE_TASK = "REMOVE_TASK"; // hits tasksReducer + usersTasksReducer
export const RECEIVE_USERS_TASK = "RECEIVE_USERS_TASK"; // hits usersTasksReducer
export const REMOVE_USERS_TASKS = "REMOVE_USERS_TASKS"; // hits usersTasksReducer
// export const REMOVE_TASK_FROM_WORKSPACE = "REMOVE_TASK_FROM_WORKSPACE";

const receiveTask = function (task) {
  return {
    type: RECEIVE_TASK,
    task
  }
}

const receiveTaskErrors = function (errors) {
  return {
    type: RECEIVE_TASK_ERRORS,
    errors
  }
}

const removeTask = function (task) {
  return {
    type: REMOVE_TASK,
    task
  }
}

const receiveUsersTask = function (usersTask) {
  return {
    type: RECEIVE_USERS_TASK,
    usersTask
  }
}

const removeUsersTask = function (usersTask) {
  return {
    type: REMOVE_USERS_TASK,
    usersTask
  }
}

// THUNK ACTIONS --------------------------------------------------

// Test Status - PASS
// Payload from backend now has task and usersTask, dispatch separate action for usersTask
export const createTask = function (task) {
  return function (dispatch) {
    // console.log("dispatching createTask");
    return (
      TaskApiUtil.createTask(task)
        .then(
          ({ task, usersTask }) => {
            dispatch(receiveTask(task))
            dispatch(receiveUsersTask(usersTask))
          },
          (errors) => dispatch(receiveTaskErrors(errors.responseJSON))
        )
    );
  };
};

// Test Status - PASS
export const updateTask = function (task) {
  return function (dispatch) {
    // console.log("dispatching updateTask");
    return (
      TaskApiUtil.updateTask(task)
        .then(
          (task) => dispatch(receiveTask(task)),
          (errors) => dispatch(receiveTaskErrors(errors.responseJSON))
        )
    );
  };
};

// Test Status - PASS
export const destroyTask = function (taskId) {
  return function (dispatch) {
    // console.log("dispatching destroyTask");
    return (
      TaskApiUtil.destroyTask(taskId)
        .then(
          (task) => dispatch(removeTask(task)),
          (errors) => dispatch(receiveTaskErrors(errors.responseJSON))
        )
    );
  };
};

// Test Status -
export const assignUsersTask = function (userId, taskId) {
  return function (dispatch) {
    // console.log("dispatching assignUsersTask");
    return (
      TaskApiUtil.assignUsersTask(userId, taskId)
        .then(
          (usersTask) => dispatch(receiveUsersTask(usersTask)),
          (errors) => dispatch(receiveTaskErrors(errors.responseJSON))
        )
    );
  };
};

export const unassignUsersTask = function (userId, taskId) {
  return function (dispatch) {
    // console.log("dispatching unassignUsersTask");
    return (
      TaskApiUtil.unassignUsersTask(userId, taskId)
        .then(
          (usersTask) => dispatch(removeUsersTask(usersTask)),
          (errors) => dispatch(receiveTaskErrors(errors.responseJSON))
        )
    );
  };
};