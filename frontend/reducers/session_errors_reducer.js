import { RESET_ALL_ERRORS } from "../actions/error_actions";
import {
  RECEIVE_SESSION_ERRORS,
  RECEIVE_CURRENT_USER
} from "../actions/session_actions";

/* Write a sessionErrorsReducer that responds to these action types:
  RECEIVE_CURRENT_USER - creates user by adding to users slice
*/

const sessionErrorsReducer = function (oldState = [], action) {
  Object.freeze(oldState);

  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return Object.assign([], action.errors);
    case RECEIVE_CURRENT_USER:
      return [];
    case RESET_ALL_ERRORS:
      return [];
    default:
      return oldState;
  }
}

export default sessionErrorsReducer;

// errors: {
//   session: []
// }