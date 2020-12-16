import React from 'react';

class WorkspaceModal extends React.Component {
  constructor(props) {
    super(props);
    this._nullState = {
      name: "",
      description: "",
      labelInputFocused: "",
    };
    this.state = Object.assign({}, this._nullState);
    this.renderCount = 0;
    // this.nameInputFocused = false;
    // this.descriptionInputFocused = false;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillUnmount() {
    this.props.receiveWorkspaceErrors([]);
  }

  handleChange(field) {
    return (evt) => {
      // if (field === "name") {
      // const filteredName = evt.target.value.replace(/[\r\n\v\t]+/g, '');
      // if (filteredName !== evt.target.value) {
      //     this.setState({ [field]: filteredName });
      //     return;
      //   } 
      // }
      let that = this;
      this.setState({ [field]: evt.currentTarget.value }, () => {
        if (field === "name" && this.state.name.length >= 25) {
          console.log("Name character max is 25");
        }
      })
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    console.log(`Test submit of creating workspace "${this.state.name}"`)
    let that = this;
    this.props.createWorkspace({
      name: this.state.name,
      description: this.state.description
    }).then((passRes) => {
      console.log("Passed, errors: ", that.props.workspaceErrors);
      // if (that.props.workspaceErrors && that.props.workspaceErrors.length === 0) {
      //   console.log("No errors");
      that.props.history.push(`/workspaces/${passRes.workspace.id}`)
      // }
    }, (failRes) => {
      console.log("Failed, errors: ", that.props.workspaceErrors);
      // console.log("fail result: ", failRes);
    })
  }

  handleFocus(field) {
    return (evt) => {
      evt.stopPropagation();
      // debugger
      if (evt.nativeEvent.type === "blur" && evt.relatedTarget !== null
        && (
          evt.relatedTarget.tagName === "INPUT"
          || evt.relatedTarget.tagName === "TEXTAREA"
          || evt.relatedTarget.tagName === "LABEL"
        )) {
        return;
      } else {
        this.setState({ labelInputFocused: field });
      }
    }
    // let fieldInputFocused = `${field}InputFocused`;
    // this.setState({ [fieldInputFocused]: !this[fieldInputFocused] });
  }

  handleClose(evt) {
    this.props.history && this.props.history.goBack();
  }

  render() {
    // debugger
    const { workspaceErrors } = this.props;
    const { name, description, labelInputFocused } = this.state;

    let nameErrors = [], descriptionErrors = [], otherErrors = [];
    if (workspaceErrors !== undefined || workspaceErrors.length !== 0) {
      workspaceErrors.forEach((error) => {
        switch (error.split(" ")[0]) {
          case ("Name"):
            nameErrors.push(error);
            break;
          case ("Description"):
            descriptionErrors.push(error);
            break;
          default:
            otherErrors.push(error);
            break;
        }
      })
    }
    this.renderCount += 1;
    console.log("workspace modal renders: ", this.renderCount);

    return (
      <div id="workspace-modal">
        <div id="workspace-modal-backdrop">
          <div>

          </div>
        </div>
        <div id="workspace-modal-box">
          <div id="workspace-modal-top">
            <h1>Create Your New Workspace</h1>
            <div id="workspace-modal-close" onClick={this.handleClose}><span>Close</span></div>
          </div>
          <form id="workspace-modal-form" onSubmit={this.handleSubmit}>
            <label htmlFor={"workspace-modal-name"} className={labelInputFocused === "name" ? "label-input-focused" : ""}>
              Workspace Name
            </label>
            <input id="workspace-modal-name" type="text"
              placeholder={"My Brand New Workspace..."}
              maxLength={"25"}
              value={name}
              onChange={this.handleChange("name")}
              onFocus={this.handleFocus("name")}
              onBlur={this.handleFocus("")} />
            <div className="workspace-error">{nameErrors.join(", ")}</div>

            <label htmlFor={"workspace-modal-description"} className={labelInputFocused === "description" ? "label-input-focused" : ""}>
              Description
            </label>
            <textarea id="workspace-modal-description"
              placeholder={"Click to add a description of your workspace..."}
              value={description}
              onChange={this.handleChange("description")}
              onFocus={this.handleFocus("description")}
              onBlur={this.handleFocus("")} ></textarea>
            <div className="workspace-error">{descriptionErrors.join(", ")}</div>
            <div className="workspace-error">{otherErrors.join(", ")}</div>
            <button id="workspace-modal-submit">Create Workspace</button>
          </form>
        </div>
      </div>
    )
  }
}

export default WorkspaceModal;