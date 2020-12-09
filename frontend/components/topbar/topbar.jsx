import React from "react";

export default class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title
    }

    // Controlling title blur event
    this.titleInput = React.createRef();
    
    // Title min and max char count
    this.titleMin = 1;
    this.titleMax = 25;

    this.topbarRenderCount = 0;

    this.handleLogout = this.handleLogout.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // console.log(`mounted Topbar (${this.props.page})`);
  }
  
  componentDidUpdate(prevProps) {
    // Reset title if we changed pages
    // console.log(`prev title: "${prevProps.title}", new title: "${this.props.title}"`);
    if (prevProps.title !== this.props.title) {
      this.setState({ title: this.props.title })
    }
  }

  handleLogout(evt) {
    evt.preventDefault();
    this.props.logout() //.then(() => this.props.history.push("/"));
  }

  // Remove all tabs, new lines + check if we're within allowable char range
  handleTitleChange(evt) {
    const editedTitle = evt.target.value.replace(/[\r\n\v\t]+/g, '');
    // console.log(`evt.target.value: "${evt.target.value}"`)
    // console.log(`old title: "${this.state.title}", new title: "${editedTitle}", length: ${editedTitle.length}, changed?: ${editedTitle !== this.state.title}`);

    // Avoid re-rendering if title hasn't changed
    if (editedTitle === this.state.title) return;
    if (editedTitle.length >= this.titleMin && editedTitle.length <= this.titleMax) this.setState({ title: editedTitle });
  }

  // If edited title differs from original, update in BE
  handleTitleUpdate(evt) {
    const { title: currentTitle, pageType, isCreator } = this.props;

    if (pageType !== "Home" && isCreator && this.state.title !== currentTitle) {
      // console.log(`title has changed from "${currentTitle}" to "${this.state.title}"`);
      const { updateItem, item } = this.props;
      if (item.id !== undefined && item.id !== null) updateItem({ id: item.id, name: this.state.title })
    }
  }

  // Catch any enter presses within title input textarea to defocus instead of adding \n
  handleKeyDown(evt) {
    if (evt.key === "Enter" || evt.keyCode === 13) {
      evt.preventDefault();
      this.titleInput.current.blur();
    }
  }

  render() {
    const { toggleSidebar, sidebarCollapse, pageType, isCreator, title: propsTitle } = this.props;
    const { title: stateTitle } = this.state; // Will change based on route
    // console.log("propsTitle: ", propsTitle, "stateTitle: ", stateTitle);
    const renderedTitle = stateTitle;

    this.topbarRenderCount += 1;
    console.log("topbar render count: ", this.topbarRenderCount);

    return (
      <div id="topbar">
        {/* <div className="sidebar-menu-button">
          <img onClick={this.props.toggleSidebar} src={window.chevronCircleRight} alt="sidebar open button" />
        </div> */}
        <button onClick={toggleSidebar} className={
          `sidebar-menu-button chevron-right ${!sidebarCollapse ? "collapsed" : ""}`
        } type="button" />
        <div id="topbar-main-header">
          <div className="header-icon">
            <span></span>
          </div>

          {/* WorkspaceHeader or HomeHeader or ProjectHeader */}
          <div className="header-title-wrapper">
            <textarea className="header-title"
              onKeyDown={this.handleKeyDown}
              onChange={this.handleTitleChange}
              onBlur={this.handleTitleUpdate}
              ref={this.titleInput}
              minLength={this.titleMin}
              maxLength={this.titleMax}
              cols={this.titleMax}
              rows={"1"}
              autoComplete="off" autoCorrect="off" autoCapitalize="off"
              spellCheck="false"
              disabled={pageType === "Home" || !isCreator}
              value={renderedTitle}
            >
            </textarea>
          </div>
        </div>
        <div id="topbar-user">
          {/* User Settings + TaskSearch + Global Actions */}
          <button id="logout-button" type="button" onClick={this.handleLogout}>Log Out</button>
        </div>
      </div>
    )
  }
};