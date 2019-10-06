import { ACTIONS as A, apiUrl } from '../config/constants';
import axios from 'axios';

// create User
export const createUserRequest = () => ({ type: A.CREATE_USER_REQUEST });
export const createUserSuccess = (payload) => ({ type: A.CREATE_USER_SUCCESS, payload });
export const createUserFailure = (err) => ({ type: A.CREATE_USER_FAILURE, err });

export const createUser = (signinName, displayName) => {
  return (dispatch) => {
    dispatch(createUserRequest());
    return axios.post(apiUrl.USERS_ROUTE, {
        signinName: signinName,
        displayName: displayName,
        favProjects: [],
        favTickets: [],
        role: "user",
        theme: "theme-light"
      }).then(response => {
        dispatch(createUserSuccess(response.data));
      })
      .catch(error => {
        dispatch(createUserFailure(error));
      }
    );
  };
};

// get single User
export const getUserRequest = () => ({ type: A.GET_USER_REQUEST });
export const getUserSuccess = (payload) => ({ type: A.GET_USER_SUCCESS, payload });
export const getUserFailure = (err) => ({ type: A.GET_USER_FAILURE, err });

export const getUser = (signinName) => {
  return (dispatch) => {
    dispatch(getUserRequest());
    const config = {
      timeout: 120000 // 120secs
    };

    return axios.get(apiUrl.USERS_ROUTE + '/' + signinName, config)
      .then(response => {
        dispatch(getUserSuccess(response.data));
      })
      .catch(error => {
        dispatch(getUserFailure(error));
        throw(error); // throw currently required to use .catch() outside of actions
      }
    );
  };
};

// update User
export const updateUserRequest = () => ({ type: A.UPDATE_USER_REQUEST });
export const updateUserSuccess = (payload) => ({ type: A.UPDATE_USER_SUCCESS, payload });
export const updateUserFailure = (err) => ({ type: A.UPDATE_USER_FAILURE, err });

export const updateUser = (currentSigninName, user) => {
  return (dispatch) => {
    dispatch(updateUserRequest());
    return axios.post(apiUrl.USERS_ROUTE + '/' + currentSigninName, user)
      .then(() => {
        dispatch(updateUserSuccess(user));
      })
      .catch(error => {
        dispatch(updateUserFailure(error));
      }
    );
  };
};

// delete User
export const deleteUserRequest = () => ({ type: A.DELETE_USER_REQUEST });
export const deleteUserSuccess = (payload) => ({ type: A.DELETE_USER_SUCCESS, payload });
export const deleteUserFailure = (err) => ({ type: A.DELETE_USER_FAILURE, err });

export const deleteUser = (signinName) => {
  return (dispatch) => {
    dispatch(deleteUserRequest());
    return axios.delete(apiUrl.USERS_ROUTE + '/' + signinName)
      .then(() => {
        dispatch(deleteUserSuccess(signinName));
      })
      .catch(error => {
        dispatch(deleteUserFailure(error));
      });
  };
};

// These are methods to set the selected User in the redux store
export const clearUserSuccess = () => ({ type: A.CLEAR_USER });

export const clearUser = () => {
  return (dispatch) => {
    dispatch(clearUserSuccess());
  };
};
