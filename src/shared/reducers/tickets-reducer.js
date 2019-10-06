import { ACTIONS as A } from '../config/constants';

const initialState = {
  inProgress: false,
  data: [],
  selected: {},
  error: {},
  deletedId: '',
  video: {}
};

const ticketsReducer = (state = initialState, action) => {
  switch(action.type) {
    case A.CREATE_TICKET_REQUEST:
      return Object.assign({}, state, { inProgress: true, selected: {} });
    case A.CREATE_TICKET_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: [...state.data, action.payload],
        selected: action.payload
      });
    case A.CREATE_TICKET_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.GET_TICKET_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.GET_TICKET_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: [...state.data, action.payload],
        selected: action.payload
      });
    case A.GET_TICKET_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.UPDATE_TICKET_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.UPDATE_TICKET_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        // replace the ticket object in the list that is being updated
        data: state.data.map(ticket => ticket.id == action.payload.id ? action.payload : ticket),
        selected: action.payload
      });
    case A.UPDATE_TICKET_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.DELETE_TICKET_REQUEST:
      return Object.assign({}, state, { inProgress: true });
    case A.DELETE_TICKET_SUCCESS:
      return Object.assign({}, state, {
        inProgress: false,
        data: state.data.filter(ticket => ticket.id !== action.payload),
        selected: {},
        deletedId: action.payload
      });
    case A.DELETE_TICKET_FAILURE:
      return Object.assign({}, state, { inProgress: false, error: action.payload });

    case A.SELECT_TICKET:
      return Object.assign({}, state, { selected: action.payload });
    case A.SELECT_VIDEO:
      return Object.assign({}, state, { video: action.payload });

    default:
      return state;
  }
};

export default ticketsReducer;
