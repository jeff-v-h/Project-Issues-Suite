import { ACTIONS as A, apiUrl } from '../config/constants';
import axios from 'axios';

// create project
export const createProjectRequest = () => ({ type: A.CREATE_PROJECT_REQUEST });
export const createProjectSuccess = (payload) => ({ type: A.CREATE_PROJECT_SUCCESS, payload });
export const createProjectFailure = (err) => ({ type: A.CREATE_PROJECT_FAILURE, err });

export const createProject = (name) => {
  return (dispatch) => {
    dispatch(createProjectRequest());
    return axios.post(apiUrl.PROJECTS_ROUTE, {
        name: name,
        tickets: []
      }).then(response => {
        dispatch(createProjectSuccess(response.data));
      })
      .catch(error => {
        dispatch(createProjectFailure(error));
      }
    );
  };
};

// get projects
export const getProjectsRequest = () => ({ type: A.GET_PROJECTS_REQUEST });
export const getProjectsSuccess = (payload) => ({ type: A.GET_PROJECTS_SUCCESS, payload });
export const getProjectsFailure = (err) => ({ type: A.GET_PROJECTS_FAILURE, err });

export const getProjectsList = () => {
  return (dispatch) => {
    dispatch(getProjectsRequest());
    return axios.get(apiUrl.PROJECTS_ROUTE)
      .then(response => {
        dispatch(getProjectsSuccess(response.data));
      })
      .catch(error => {
        dispatch(getProjectsFailure(error));
      }
    );
  };
};

// get single project
export const getProjectRequest = () => ({ type: A.GET_PROJECT_REQUEST });
export const getProjectSuccess = (payload) => ({ type: A.GET_PROJECT_SUCCESS, payload });
export const getProjectFailure = (err) => ({ type: A.GET_PROJECT_FAILURE, err });

export const getProject = (name) => {
  return (dispatch) => {
    dispatch(getProjectRequest());
    return axios.get(apiUrl.PROJECTS_ROUTE + '/' + name)
      .then(response => {
        dispatch(getProjectSuccess(response.data));
      })
      .catch(error => {
        dispatch(getProjectFailure(error));
      }
    );
  };
};

// update project
export const updateProjectRequest = () => ({ type: A.UPDATE_PROJECT_REQUEST });
export const updateProjectSuccess = (payload) => ({ type: A.UPDATE_PROJECT_SUCCESS, payload });
export const updateProjectFailure = (err) => ({ type: A.UPDATE_PROJECT_FAILURE, err });

export const updateProject = (currentName, project) => {
  return (dispatch) => {
    dispatch(updateProjectRequest());
    return axios.post(apiUrl.PROJECTS_ROUTE + '/' + currentName, project)
      .then(() => {
        dispatch(updateProjectSuccess(project));
      })
      .catch(error => {
        dispatch(updateProjectFailure(error));
      }
    );
  };
};

// delete project
export const deleteProjectRequest = () => ({ type: A.DELETE_PROJECT_REQUEST });
export const deleteProjectSuccess = (payload) => ({ type: A.DELETE_PROJECT_SUCCESS, payload });
export const deleteProjectFailure = (err) => ({ type: A.DELETE_PROJECT_FAILURE, err });

export const deleteProject = (name) => {
  return (dispatch) => {
    dispatch(deleteProjectRequest());
    return axios.delete(apiUrl.PROJECTS_ROUTE + '/' + name)
      .then(() => {
        dispatch(deleteProjectSuccess(name));
      })
      .catch(error => {
        dispatch(deleteProjectFailure(error));
      });
  };
};

// These are methods to set the selected project in the redux store
export const selectProjectSuccess = (payload) => ({ type: A.SELECT_PROJECT, payload });

export const selectProject = (project) => {
  return (dispatch) => {
    dispatch(selectProjectSuccess(project));
  };
};

// These are methods to set the selected project in the redux store
export const clearProjectListSuccess = () => ({ type: A.CLEAR_PROJECT_LIST });

export const clearProjectList = () => {
  return (dispatch) => {
    dispatch(clearProjectListSuccess());
  };
};
