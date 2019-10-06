import { ACTIONS as A } from '../config/constants';

const initialState = {
  inProgress: false,
  data: {},
  error: {}
};

const UsersReducer = (state = initialState, action) => {
  switch(action.type) {
    case A.CREATE_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.CREATE_USER_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: action.payload });
    case A.CREATE_USER_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.GET_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.GET_USER_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: action.payload });
    case A.GET_USER_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.UPDATE_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.UPDATE_USER_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: action.payload });
    case A.UPDATE_USER_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.DELETE_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.DELETE_USER_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: {} });
    case A.DELETE_USER_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.CLEAR_USER:
      return Object.assign({}, state, { data: {} });

    default:
      return state;
  }
};

export default UsersReducer;
