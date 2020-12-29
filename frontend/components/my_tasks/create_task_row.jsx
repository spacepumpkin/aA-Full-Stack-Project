import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../actions/task_actions';

export default function CreateTaskRow({ allWorkspaces, allProjects }) {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     task: {
  //       name: "",
  //       description: "",
  //       dueDate: "",
  //       workspaceId: -1,
  //       projectId: -1
  //     },
  //     selectedWorkspaceId: null,
  //     selectedProjectId: null
  //   }
  // }
  const dispatch = useDispatch();

  // const workspaceRef = useRef(null);
  const projectRef = useRef(null);

  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [dueDate, setdueDate] = useState("");
  // const [workspaceId, setworkspaceId] = useState(-1);
  const [projectId, setprojectId] = useState(-1);
  // const [itemIds, setitemIds] = useState({
  //   workspaceId: -1,
  //   projectId: -1
  // });

  // Get workspace dropdown list depending on whether a project was selected
  // const defaultWorkspaceOptions = Object.values(allWorkspaces).map(workspace => {
  //   return (<option key={workspace.id} value={workspace.id}>{workspace.name}</option>);
  // });

  // const [workspaceOptions, setWorkspaceOptions] = useState(defaultWorkspaceOptions);

  // useEffect(() => {
  //   if (projectId !== -1) {
  //     let newWorkspaceOptions = [];
  //     let projectWorkspaceId = allProjects[projectId].workspaceId;
  //     // debugger
  //     // for (let workspaceId in allWorkspaces) {
  //     //   if (workspaceId === projectWorkspaceId) {
  //     newWorkspaceOptions.push(
  //       <option key={projectWorkspaceId} value={projectWorkspaceId}>{allWorkspaces[projectWorkspaceId].name}</option>
  //     );
  //     //   }
  //     // }
  //     // setprojectId(projectId);
  //     setWorkspaceOptions(newWorkspaceOptions);
  //   }
  // }, [projectId])


  // Get project dropdown list depending on whether a workspace was selected
  const defaultProjectOptions = Object.values(allProjects).map(project => {
    return (<option key={project.id} value={project.id}>{project.name}</option>);
  });

  const [projectOptions, setProjectOptions] = useState(defaultProjectOptions);

  // useEffect(() => {
  //   if (workspaceId !== -1) {
  //     let newProjectOptions = [];
  //     for (let projectId in allProjects) {
  //       let project = allProjects[projectId];
  //       if (project.workspaceId === workspaceId) {
  //         newProjectOptions.push(
  //           <option key={projectId} value={projectId}>{project.name}</option>
  //         );
  //       }
  //     }
  //     // setworkspaceId(workspaceId);
  //     setProjectOptions(newProjectOptions);
  //   }
  // }, [workspaceId])

  // function changeWorkspaceOptions(selectedProjectId) {
  //   let projectWorkspaceId = allProjects[selectedProjectId].workspaceId;
  //   setWorkspaceOptions([<option key={projectWorkspaceId} value={projectWorkspaceId}>{allWorkspaces[projectWorkspaceId].name}</option>]);
  // }

  // function changeProjectOptions(selectedWorkspaceId) {
  //   let newProjectOptions = [];
  //   for (let projectId in allProjects) {
  //     let project = allProjects[projectId];
  //     if (project.workspaceId === selectedWorkspaceId) {
  //       newProjectOptions.push(
  //         <option key={projectId} value={projectId}>{project.name}</option>
  //       );
  //     }
  //   }
  //   setProjectOptions(newProjectOptions);
  // }

  function handleChange(field) {
    return (evt) => {
      let newValue = evt.target.value;
      if (field === "projectId") {
        newValue = parseInt(newValue);
        // changeWorkspaceOptions(newValue); 
      } 
      // else if (field === "workspaceId") {
      //   newValue = parseInt(newValue);
      //   // changeProjectOptions(newValue);
      // }
      eval(`set${field}`)(newValue);
      console.log(newValue);
    }
  }

  
  useEffect(() => {
    if (projectRef !== null) {
      // setworkspaceId(parseInt(workspaceRef.current.value));
      setprojectId(parseInt(projectRef.current.value));
      // console.log("workspaceRef: ", workspaceRef.current.value, "; ","projectRef: ", projectRef.current.value);
    }
  },[projectRef])
  
  console.log({ name: name, description: description, dueDate: dueDate, projectId: projectId });

  function addNewTask() {
    dispatch(createTask({ name: name, description: description, dueDate: dueDate, projectId: projectId }));
  }
  
  return (
    <tr className="my-tasks-create-row">
      <td><input type="text" className="task-input" value={name} placeholder="Add New Task"
        // onChange={(evt) => setname(evt.target.value) && console.log("name: ", evt.target.value)} 
        onChange={handleChange("name")}
      /></td>
      <td><input type="text" className="task-input" value={description} placeholder="Add Description"
        // onChange={(evt) => setdescription(evt.target.value) && console.log("description: ", evt.target.value)} 
        onChange={handleChange("description")}
      /></td>
      <td><input type="date" className="my-tasks-date" value={dueDate}
        // onChange={(evt) => setdueDate(evt.target.value) && console.log("dueDate: ", evt.target.value)} 
        onChange={handleChange("dueDate")}
      /></td>
      {/* <td>
        <select
          ref={workspaceRef}
          onChange={handleChange("workspaceId")}
        >
          {workspaceOptions}
        </select>
      </td> */}
      <td>
        <select
          ref={projectRef}
          // onChange={(evt) => setprojectId(evt.target.value) && console.log("project: ", evt.target.value)}
          onChange={handleChange("projectId")}
        >
          {/* <option value="project-0" disabled>Select a Project</option> */}
          {/* <option value="" disabled selected hidden>Select a Project</option> */}
          {projectOptions}
        </select>
      </td>
      <td>{!!name ? <button type="button" className="add-task-button" onClick={addNewTask}>Add New Task</button> : null}</td>
    </tr>
  )
}

// export default CreateTaskRow;