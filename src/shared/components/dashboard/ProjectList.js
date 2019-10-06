import React from 'react';
import { array, func, object } from 'prop-types';
import { Menu } from 'semantic-ui-react';

ProjectList.propTypes = {
  projectNames: array,
  changeProject: func.isRequired,
  selectedProject: object
};

function ProjectList({ projects, changeProject, selectedProject }) {
  return (
    projects.map(project =>
      <Menu.Item name={project.name}
        key={project.name}
        content={project.name}
        onClick={changeProject(project)}
        active={selectedProject === project.name} />)
  );
}

export default ProjectList;
