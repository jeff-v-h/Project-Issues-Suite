import { ACTIONS as A } from "../config/constants";

const fakeUser = {
  id: "feb35898-d647-4676-a747-2440fe3efdbf",
  displayName: "Test User",
  role: "user",
  signinName: "Test.User@random.com",
  theme: "theme-light",
  favProjects: [],
  favTickets: []
};

const initialState = {
  inProgress: false,
  data: {},
  error: {}
};

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case A.CREATE_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.CREATE_USER_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: action.payload
      });
    case A.CREATE_USER_FAILURE:
      return Object.assign({}, state, {
        inProgress: false,
        error: action.payload
      });

    case A.GET_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.GET_USER_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: action.payload
      });
    case A.GET_USER_FAILURE:
      return Object.assign({}, state, {
        inProgress: false,
        error: action.payload
      });

    case A.UPDATE_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: action.payload
      });
    case A.UPDATE_USER_FAILURE:
      return Object.assign({}, state, {
        inProgress: false,
        error: action.payload
      });

    case A.DELETE_USER_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.DELETE_USER_SUCCESS:
      return Object.assign({}, state, { inProgress: false, data: {} });
    case A.DELETE_USER_FAILURE:
      return Object.assign({}, state, {
        inProgress: false,
        error: action.payload
      });

    case A.CLEAR_USER:
      return Object.assign({}, state, { data: {} });
    case "SET_FAKE_USER":
      return Object.assign({}, state, { data: fakeUser });

    default:
      return state;
  }
};

export default UsersReducer;
