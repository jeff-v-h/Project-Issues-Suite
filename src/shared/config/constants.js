import { createStringConstants } from '../../helpers/utils';
import styled from 'styled-components';

// General constants
export const videoLimits = {
  SIZE: 324288000,
  MESSAGE: 'Each video file size must not exceed 300MB',
  SIZE_TOTAL: 924288000,
  MESSAGE_TOTAL: 'Total combined file sizes must not exceed 900MB',
};

export const roles = {
  ADMIN: 'admin',
  USER: 'user'
};

export const status = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  CLOSED: 'closed'
};

// Styled Divs
export const EmptyDiv = styled.div`
  min-width: 38px;
`;

export const EmptyDiv125px = styled.div`
  min-width: 125px;
`;

export const MidDivWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

// app url paths
export const publicPath = '/';

export const routeCodes = {
  HOME: publicPath,
  DASHBOARD: `/dashboard`,
  TICKETS: `/tickets`,
  VIDEOS: `/videos`,
  BROWSE: `/browse`,
  UPLOAD: `/upload`,
  LOGINREQ: `/login-req`,
  LOGIN: `/login`,
  LOGOUT: `/logout`,
  MANAGE_PROJECTS: `/manageProjects`,
  CONTACT: `/contact`,
  SETTINGS: `/settings`,
  NEW_PROJECT: `/newProject`,
  NEW_TICKET: `/newTicket`,
  NEW_VIDEO: `/newVideo`,
  EDIT: `/edit`,
  DELETE: `/delete`
};

// api url
export const HOST = process.env.API_URI;
export const API_PATH = `/api`;
export const PROJECTS_PATH = `/projects`;
export const TICKETS_PATH = `/tickets`;
export const USERS_PATH = `/users`;

export const apiUrl = {
  HOST: `${HOST}`,
  API_PATH: `${API_PATH}`,
  PROJECTS_PATH: `${PROJECTS_PATH}`,
  TICKETS_PATH: `${TICKETS_PATH}`,
  USERS_PATH: `${USERS_PATH}`,
  WITH_VIDEOS_PATH: '/withvideos',
  PROJECTS_ROUTE: `${HOST}${API_PATH}${PROJECTS_PATH}`,
  TICKETS_ROUTE: `${HOST}${API_PATH}${TICKETS_PATH}`,
  USERS_ROUTE: `${HOST}${API_PATH}${USERS_PATH}`
};

// Browser check
export const CRYPTOBJ = window.crypto || window.msCrypto; // For IE11

// Authentication
export const authConstants = {
  AUTH_ENDPOINT: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?',
  REDIRECT_URI: process.env.REDIRECT_URI,
  CLIENT_ID: process.env.CLIENT_ID,
  SCOPES: 'openid profile User.Read Mail.Read',
};

// redux action constants
const projectsActions = [
  'CREATE_PROJECT_REQUEST',
  'CREATE_PROJECT_SUCCESS',
  'CREATE_PROJECT_FAILURE',
  'GET_PROJECTS_REQUEST',
  'GET_PROJECTS_SUCCESS',
  'GET_PROJECTS_FAILURE',
  'GET_PROJECT_REQUEST',
  'GET_PROJECT_SUCCESS',
  'GET_PROJECT_FAILURE',
  'UPDATE_PROJECT_REQUEST',
  'UPDATE_PROJECT_SUCCESS',
  'UPDATE_PROJECT_FAILURE',
  'DELETE_PROJECT_REQUEST',
  'DELETE_PROJECT_SUCCESS',
  'DELETE_PROJECT_FAILURE',
  'SELECT_PROJECT',
  'CLEAR_PROJECT_LIST'
];

const ticketsActions = [
  'CREATE_TICKET_REQUEST',
  'CREATE_TICKET_SUCCESS',
  'CREATE_TICKET_FAILURE',
  'GET_TICKET_REQUEST',
  'GET_TICKET_SUCCESS',
  'GET_TICKET_FAILURE',
  'UPDATE_TICKET_REQUEST',
  'UPDATE_TICKET_SUCCESS',
  'UPDATE_TICKET_FAILURE',
  'DELETE_TICKET_REQUEST',
  'DELETE_TICKET_SUCCESS',
  'DELETE_TICKET_FAILURE',
  'SELECT_TICKET',
  'SELECT_VIDEO'
];

const usersActions = [
  'CREATE_USER_REQUEST',
  'CREATE_USER_SUCCESS',
  'CREATE_USER_FAILURE',
  'GET_USER_REQUEST',
  'GET_USER_SUCCESS',
  'GET_USER_FAILURE',
  'UPDATE_USER_REQUEST',
  'UPDATE_USER_SUCCESS',
  'UPDATE_USER_FAILURE',
  'DELETE_USER_REQUEST',
  'DELETE_USER_SUCCESS',
  'DELETE_USER_FAILURE',
  'CLEAR_USER'
];

export const ACTIONS = createStringConstants(
  ...projectsActions,
  ...ticketsActions,
  ...usersActions
);
