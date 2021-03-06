import { connect } from "react-redux";
import SessionForm from "./session_form";

import { login, receiveSessionErrors } from "../../actions/session_actions";
import { setLoader } from "../../actions/ui_actions";

// class LoginSessionForm extends React.Component {
//   constructor (props) {
//     super(props);
//   }

//   render() {
//     <div>

//     </div>
//   }
// }

const mapStateToProps = function (state, ownProps) {
  return {
    formType: "Log In",
    sessionErrors: state.errors.session
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    setLoader: (loaderState) => dispatch(setLoader(loaderState)),
    processForm: (user) => dispatch(login(user)),
    receiveSessionErrors: (errors) => dispatch(receiveSessionErrors(errors))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionForm);