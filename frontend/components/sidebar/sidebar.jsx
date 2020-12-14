import React from "react";
import { Link, NavLink } from "react-router-dom";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    // Keep track of which workspace is selected, which plus button is selected
    this.state = {
      activeWorkspaceId: -1,
      plusMenuWorkspaceId: -1
    }
    this.showPlusMenu = this.showPlusMenu.bind(this);
    this.sidebarRenderCount = 0;
  }

  componentDidMount() {
    // console.log(`mounted Sidebar`);
  }

  showPlusMenu(workspaceId) {
    return (e) => {
      if (this.state.plusMenuWorkspaceId === workspaceId) {
        this.setState({ plusMenuWorkspaceId: -1 })
      } else {
        this.setState({ plusMenuWorkspaceId: workspaceId, activeWorkspaceId: workspaceId })
      }
    }
  }

  showProjects(workspaceId) {
    return (e) => {
      if (this.state.activeWorkspaceId === workspaceId) {
        this.setState({ activeWorkspaceId: -1, plusMenuWorkspaceId: -1 })
      } else {
        this.setState({ activeWorkspaceId: workspaceId, plusMenuWorkspaceId: -1 })
      }
    }
  }

  render() {
    const { workspaces = {}, projects = {}, toggleSidebar, sidebarCollapse, currentUserId } = this.props;
    const { activeWorkspaceId, plusMenuWorkspaceId } = this.state;

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
              <button className={`sidebar-workspace-plus ${(showMenu) ? "rotated-plus" : ""}`} onClick={this.showPlusMenu(workspace.id)} type="button" />
              {/* Had to move menu out from here to get z-index to work */}
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
            <div className={`sidebar-workspace-plus-menu ${(showMenu) ? "show-menu" : ""}`}>
              <Link to={`/projects/new`}>Create New Project</Link>
              <Link to={`/projects/new`}>Delete Workspace</Link>
            </div>
          </div>
        )
      }
      )
    )

    return (
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
          <button type="button">Create New Workspace</button>
        </div>
      </div >
    )
  }
}