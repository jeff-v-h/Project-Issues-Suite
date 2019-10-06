import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import projectsReducer from './projects-reducer.js';
import ticketsReducer from './tickets-reducer.js';
import usersReducer from './users-reducer.js';

const rootReducer = (history) => combineReducers({
  projects: projectsReducer,
  tickets: ticketsReducer,
  users: usersReducer,
  router: connectRouter(history)
});

export default rootReducer;
