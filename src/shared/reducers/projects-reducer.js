import { ACTIONS as A } from '../config/constants';

const initialState = {
  inProgress: false,
  data: [], // a list/array is expected from the api
  selected: {},
  error: {}
};

const projectsReducer = (state = initialState, action) => {
  switch(action.type) {
    case A.CREATE_PROJECT_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.CREATE_PROJECT_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: [...state.data, action.payload] });
    case A.CREATE_PROJECT_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.GET_PROJECTS_REQUEST:
      return Object.assign({}, state, { inProgress: true, selected: {} });
    case A.GET_PROJECTS_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: action.payload });
    case A.GET_PROJECTS_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.GET_PROJECT_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.GET_PROJECT_SUCCESS:
      return Object.assign({}, state, { inProgress: false, selected: action.payload });
    case A.GET_PROJECT_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.UPDATE_PROJECT_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.UPDATE_PROJECT_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: state.data.map(project => project.id == action.payload.id ? action.payload : project)
      });
    case A.UPDATE_PROJECT_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.DELETE_PROJECT_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.DELETE_PROJECT_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: state.data.filter(project => project.name !== action.payload),
        selected: {}
      });
    case A.DELETE_PROJECT_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.SELECT_PROJECT:
      return Object.assign({}, state, { selected: action.payload });
    case A.CLEAR_PROJECT_LIST:
      return Object.assign({}, state, { data: [] });

    default:
      return state;
  }
};

export default projectsReducer;
