import { ACTIONS as A, apiUrl } from '../config/constants';
import axios from 'axios';

// create ticket
export const createTicketRequest = () => ({ type: A.CREATE_TICKET_REQUEST });
export const createTicketSuccess = (payload) => ({ type: A.CREATE_TICKET_SUCCESS, payload });
export const createTicketFailure = (err) => ({ type: A.CREATE_TICKET_FAILURE, err });

export const createTicket = (newTicket) => {
  return (dispatch) => {
    dispatch(createTicketRequest());
    return axios.post(apiUrl.TICKETS_ROUTE, newTicket)
      .then(response => {
        dispatch(createTicketSuccess(response.data));
      })
      .catch(error => {
        dispatch(createTicketFailure(error));
        throw(error);
      });
  };
};

export const createTicketWithVideos = (formData) => {
  return (dispatch) => {
    dispatch(createTicketRequest());

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000 // 120secs
    };

    return axios.post(apiUrl.TICKETS_ROUTE + apiUrl.WITH_VIDEOS_PATH, formData, config)
      .then(response => {
        dispatch(createTicketSuccess(response.data));
      })
      .catch(error => {
        dispatch(createTicketFailure(error));
        throw(error);
      });
  };
};

// get specific ticket
export const getTicketRequest = () => ({ type: A.GET_TICKET_REQUEST });
export const getTicketSuccess = (payload) => ({ type: A.GET_TICKET_SUCCESS, payload });
export const getTicketFailure = (err) => ({ type: A.GET_TICKET_FAILURE, err });

export const getTicket = (id) => {
  return (dispatch) => {
    dispatch(getTicketRequest());
    return axios.get(apiUrl.TICKETS_ROUTE + '/' + id)
      .then(response => {
        dispatch(getTicketSuccess(response.data));
      })
      .catch(error => {
        dispatch(getTicketFailure(error));
        throw(error);
      });
  };
};

export const getTicketByName = (projectName, ticketName) => {
  return (dispatch) => {
    dispatch(getTicketRequest());
    return axios.get(apiUrl.TICKETS_ROUTE + '/' + projectName + '/' + ticketName)
      .then(response => {
        dispatch(getTicketSuccess(response.data));
      })
      .catch(error => {
        dispatch(getTicketFailure(error));
        throw(error);
      });
  };
};

// update ticket
export const updateTicketRequest = () => ({ type: A.UPDATE_TICKET_REQUEST });
export const updateTicketSuccess = (payload) => ({ type: A.UPDATE_TICKET_SUCCESS, payload });
export const updateTicketFailure = (err) => ({ type: A.UPDATE_TICKET_FAILURE, err });

export const updateTicket = (updatedTicket) => {
  return (dispatch) => {
    dispatch(updateTicketRequest());
    return axios.post(apiUrl.TICKETS_ROUTE + '/' + updatedTicket.id, updatedTicket)
      .then(() => {
        dispatch(updateTicketSuccess(updatedTicket));
      })
      .catch(error => {
        dispatch(updateTicketFailure(error));
        throw(error);
      });
  };
};

export const updateTicketWithVideos = (ticketId, formData) => {
  return (dispatch) => {
    dispatch(updateTicketRequest());

    const path = apiUrl.TICKETS_ROUTE + '/' + ticketId + apiUrl.WITH_VIDEOS_PATH;
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000 // 120secs
    };

    return axios.post(path, formData, config)
      .then(() => {
        dispatch(updateTicketSuccess(formData));
      })
      .catch(error => {
        dispatch(updateTicketFailure(error));
        throw(error);
      });
  };
};

// delete ticket
export const deleteTicketRequest = () => ({ type: A.DELETE_TICKET_REQUEST });
export const deleteTicketSuccess = (payload) => ({ type: A.DELETE_TICKET_SUCCESS, payload });
export const deleteTicketFailure = (err) => ({ type: A.DELETE_TICKET_FAILURE, err });

export const deleteTicket = (id) => {
  return (dispatch) => {
    dispatch(deleteTicketRequest());
    return axios.delete(apiUrl.TICKETS_ROUTE + '/' + id)
      .then(() => {
        dispatch(deleteTicketSuccess(id));
      })
      .catch(error => {
        dispatch(deleteTicketFailure(error));
        throw(error);
      });
  };
};

// These are methods to set the selected ticket in the redux store
export const selectTicketSuccess = (payload) => ({ type: A.SELECT_TICKET, payload });

export const selectTicket = (ticket) => {
  return (dispatch) => {
    dispatch(selectTicketSuccess(ticket));
  };
};

// select a particular video from a ticket
export const selectVideoSuccess = (payload) => ({ type: A.SELECT_VIDEO, payload });

export const selectVideo = (video) => {
  return (dispatch) => {
    dispatch(selectVideoSuccess(video));
  };
};
