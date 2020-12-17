import React from "react";
import { Link, NavLink } from "react-router-dom";
import Workspace from "../workspace/workspace";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    // Keep track of which workspace is selected, which plus button is selected
    this.state = {
      activeWorkspaceId: -1,
      plusMenuWorkspaceId: -1,
      showModal: false
    }
    this.sidebarRenderCount = 0;
    this.sidebarDropdownRef = React.createRef();

    this.showPlusMenu = this.showPlusMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    // console.log(`mounted Sidebar`);
    // document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    // document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside(evt) {
    // debugger
    console.log("handleClickOutside");
    // Only react if a plusMenu dropdown is open & if click target is not something 
    // on which we already have a listener, otherwise do nothing
    if (this.state.plusMenuWorkspaceId !== -1
      && !evt.target.classList.contains("sidebar-workspace-plus")
      && !evt.target.classList.contains("sidebar-workspace-title")) {
      if (this.sidebarDropdownRef && !this.sidebarDropdownRef.current.contains(evt.target)) {
        // alert("You clicked outside the sidebar dropdown menu!");
        this.setState({ plusMenuWorkspaceId: -1 });
      }
    }
  }

  showPlusMenu(workspaceId) {
    let that = this;
    return (evt) => {
      // if this is the blur event
      if (evt.nativeEvent.type === "blur") {
        // if we're not clicking another plus or title, or inside the plus menu, close current plus menu; 
        // else stop and let click handler go
        if (evt.relatedTarget === null
          || (
            evt.relatedTarget.classList[0] !== "sidebar-workspace-plus"
            && evt.relatedTarget.classList[0] !== "sidebar-workspace-title"
            && that.sidebarDropdownRef && !that.sidebarDropdownRef.current.contains(evt.relatedTarget)
          )
        ) {
          this.setState({ plusMenuWorkspaceId: -1 });
        }
        return;
      }
      // if this is the click event
      if (this.state.plusMenuWorkspaceId === workspaceId) {
        this.setState({ plusMenuWorkspaceId: -1 });
      } else {
        this.setState({ plusMenuWorkspaceId: workspaceId, activeWorkspaceId: workspaceId })
      }
    }
  }

  showProjects(workspaceId) {
    return (evt) => {
      if (this.state.activeWorkspaceId === workspaceId) {
        this.setState({ activeWorkspaceId: -1, plusMenuWorkspaceId: -1 })
      } else {
        this.setState({ activeWorkspaceId: workspaceId, plusMenuWorkspaceId: -1 })
      }
    }
  }

  toggleModal(evt) {
    // evt.preventDefault();
    this.setState({ showModal: !this.state.showModal, plusMenuWorkspaceId: -1 })
  }

  render() {
    const { workspaces = {}, projects = {}, toggleSidebar, sidebarCollapse, currentUserId } = this.props;
    const { activeWorkspaceId, plusMenuWorkspaceId, showModal } = this.state;
    // debugger

    this.sidebarRenderCount += 1;
    console.log("sidebar render count: ", this.sidebarRenderCount);

    // Separate user's workspaces into own and other workspaces
    const ownWorkspaces = [];
    const otherWorkspaces = [];

    Object.values(workspaces).forEach((workspace) => {
      if (workspace.creatorId === currentUserId) {
        ownWorkspaces.push(workspace);
      } else {
        otherWorkspaces.push(workspace);
      }
    })

    const mappedWorkspaces = (selectedWorkspaces) => (
      selectedWorkspaces.map((workspace) => {
        let showMenu = plusMenuWorkspaceId === workspace.id;
        let showProjects = activeWorkspaceId === workspace.id;
        return (
          <div className="sidebar-workspace-box" key={`workspace-${workspace.id}`}>
            <div className="sidebar-workspace-title-wrapper">
              <Link to={`/workspaces/${workspace.id}`}
                className={`sidebar-workspace-title ${showProjects ? "selected-primary" : ""}`}
                onClick={this.showProjects(workspace.id)}
              >
                {workspace.name}
              </Link>
              <button className={`sidebar-workspace-plus ${(showMenu) ? "rotated-plus" : ""}`}
                onClick={this.showPlusMenu(workspace.id)} type="button"
                tabIndex="0"
                onBlur={this.showPlusMenu()} />
              {/* Had to remove z-index on sidebar-workspace-projects to get this to show */}
            </div>
            <div className="sidebar-workspace-projects">
              {
                (showProjects) &&
                Object.values(projects).map((project) => {
                  return (
                    (project.workspaceId === workspace.id) &&
                    <Link to={`/projects/${project.id}/list`} key={`project-${project.id}`} className="sidebar-workspace-project"><span></span>&nbsp;{project.name}</Link>
                  )
                })
              }
            </div>
            <div className={`sidebar-workspace-plus-menu ${(showMenu) ? "show-menu" : ""}`}
              ref={showMenu && this.sidebarDropdownRef}
            >
              <Link to={`/projects/new`}>Create New Project</Link>
              {(currentUserId === workspace.creatorId) ? (
                <button type="button" onClick={this.toggleModal}>Delete Workspace</button>
              ) : (
                  <Link to={`/home`}>Leave Workspace</Link>
                )}
            </div>
          </div>
        )
      }
      )
    )

    return (
      <>
        <div id="sidebar" className={`${sidebarCollapse ? "collapsed" : ""}`} >
          <div id="sidebar-top">
            <Link id="sidebar-logo" to="/home" > <img src={window.logoMainURL} /> </Link>
            <button onClick={toggleSidebar} className={`sidebar-menu-button chevron-left`} type="button" />
          </div>
          <div id="sidebar-links">
            <Link to="/home"><img className="sidebar-icon" src={window.homeIcon} alt="homeicon" />&nbsp; Home </Link>
            <Link to="/home"><img className="sidebar-icon" src={window.checkCircle} alt="taskicon" />&nbsp; My Tasks </Link>
          </div>
          <div id="sidebar-workspaces">
            <h1>My Workspaces</h1>
            {mappedWorkspaces(ownWorkspaces)}
          </div>
          <div id="sidebar-workspaces">
            <h1>Other Workspaces</h1>
            {mappedWorkspaces(otherWorkspaces)}
          </div>
          <div id="sidebar-bottom">
            {/* <p>Organize your projects here!</p> */}
            <Link to="/workspaces/new"><button type="button">Create New Workspace</button></Link>
          </div>
        </div >
        { showModal &&
          <WorkspaceDeleteModal
            workspace={Object.values(workspaces).find((workspace) => workspace.id === plusMenuWorkspaceId)}
            toggleModal={this.toggleModal} />
        }
      </>
    )
  }
}

function WorkspaceDeleteModal({ workspace = { name: "" }, toggleModal }) {
  // let workspace = Object.values(workspaces).find((workspace) => workspace.id === plusMenuWorkspaceId);
  return (
    <div className="workspace-modal">
      <div className="modal-backdrop"></div>
      <div className="workspace-modal-box">
        <div className={`modal-close`} onClick={toggleModal}><span>Close</span></div>
        <div>
          <h1>{`Delete ${workspace.name}?`}</h1>
        </div>
        <div>
          If you delete this workspace, all associated projects and tasks will also be deleted and other members
          will no longer be able to access it. Are you sure?
        </div>
        <div>
          <button type="button">Yes</button>
          <button type="button" onClick={toggleModal}>Cancel</button>
        </div>

      </div>
    </div>
  )
}