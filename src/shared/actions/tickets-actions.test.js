import configureStore from 'redux-mock-store';
import * as actions from './tickets-actions';
import { ACTIONS as A, apiUrl } from '../config/constants';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const axiosMock = new MockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('tickets-actions', () => {
  beforeEach(() => {
    axiosMock.reset();
    store.clearActions();
  });

  const store = mockStore();

  describe('getTicket', () => {
    it('dispatches SUCCESS when GET request for a single ticket has been completed', () => {
      const ticket = {
        id: '1234',
        name: 'Logout Bug',
        description: 'There was an issue',
        projectName: 'ATP',
        videos: [
          {
            id: '555',
            title: 'Bug Recreated',
            description: 'Logging out after idle for 5 mins creates issue',
            url: 'www.d3vids.com',
            length: '00:00:00'
          }
        ]
      };

      axiosMock.onGet(apiUrl.TICKETS_ROUTE + '/1234').reply(200, ticket);

      const expectedActions = [
        { type: A.GET_TICKET_REQUEST },
        { type: A.GET_TICKET_SUCCESS, payload: ticket }
      ];

      return store.dispatch(actions.getTicket('1234')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches FAILURE when GET request does not complete', () => {
      axiosMock.onGet(apiUrl.TICKETS_ROUTE + '/777').reply(404);

      const expectedActions = [
        { type: A.GET_TICKET_REQUEST },
        { type: A.GET_TICKET_FAILURE, err: Error('Request failed with status code 404') }
      ];

      return store.dispatch(actions.getTicket()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('createTicket', () => {
    it('dispatches SUCCESS when POST request has been completed', () => {
      const expectedCreatedTicket = {
        id: '4321',
        name: 'New Bug',
        description: 'There was an issue',
        projectName: 'BT',
        videos: []
      };

      axiosMock.onPost(apiUrl.TICKETS_ROUTE).reply(201, expectedCreatedTicket);

      const expectedActions = [
        { type: A.CREATE_TICKET_REQUEST },
        { type: A.CREATE_TICKET_SUCCESS, payload: expectedCreatedTicket }
      ];

      return store.dispatch(actions.createTicket('New Bug', 'There was an issue', 'BT'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('dispatches FAILURE when POST request does not complete', () => {
      axiosMock.onPost(apiUrl.TICKETS_ROUTE).reply(400);

      const expectedActions = [
        { type: A.CREATE_TICKET_REQUEST },
        { type: A.CREATE_TICKET_FAILURE, err: Error('Request failed with status code 400') }
      ];

      return store.dispatch(actions.createTicket('New Bug', 'There was an issue', 'NONE'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('updateTicket', () => {
    const updatedTicket = {
      id: '4321',
      name: 'New Bug',
      description: 'There was a minor issue',
      projectName: 'BT',
      videos: []
    };

    it('dispatches SUCCESS when POST request has been completed', () => {
      axiosMock.onPost(apiUrl.TICKETS_ROUTE + '/4321', updatedTicket).reply(204);

      const expectedActions = [
        { type: A.UPDATE_TICKET_REQUEST },
        { type: A.UPDATE_TICKET_SUCCESS, payload: updatedTicket }
      ];

      return store.dispatch(actions.updateTicket(updatedTicket))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('dispatches FAILURE when POST request does not complete', () => {
      axiosMock.onPost(apiUrl.TICKETS_ROUTE + '/4321', updatedTicket).reply(404);

      const expectedActions = [
        { type: A.UPDATE_TICKET_REQUEST },
        { type: A.UPDATE_TICKET_FAILURE, err: Error('Request failed with status code 404') }
      ];

      return store.dispatch(actions.updateTicket(updatedTicket))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('deleteTicket', () => {
    it('dispatches SUCCESS when DELETE request has been completed', () => {
      axiosMock.onDelete(apiUrl.TICKETS_ROUTE + '/666').reply(204);

      const expectedActions = [
        { type: A.DELETE_TICKET_REQUEST },
        { type: A.DELETE_TICKET_SUCCESS, payload: '666' }
      ];

      return store.dispatch(actions.deleteTicket('666')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches FAILURE when DELETE request does not complete', () => {
      axiosMock.onDelete(apiUrl.TICKETS_ROUTE + '/789').reply(404);

      const expectedActions = [
        { type: A.DELETE_TICKET_REQUEST },
        { type: A.DELETE_TICKET_FAILURE, err: Error('Request failed with status code 404') }
      ];

      return store.dispatch(actions.deleteTicket('789')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
