import configureStore from 'redux-mock-store';
import * as actions from './projects-actions';
import { ACTIONS as A, apiUrl } from '../config/constants';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const axiosMock = new MockAdapter(axios);
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('projects-actions', () => {
  beforeEach(() => {
    axiosMock.reset();
    store.clearActions();
  });

  const store = mockStore();

  describe('getProjectsList', () => {
    it('dispatches SUCCESS when GET request for projects has been done', () => {
      const projects = [
        { id: '123', name: 'ATP', tickets: [{ 'id': '111', 'name': 'Log Bug' }, { 'id': '222', 'name': 'Issue' }] },
        { id: '789', name: 'BT', tickets: [{ 'id': '333', 'name': 'Login Problem' }] }
      ];

      // arguments for reply are (status, data, headers)
      axiosMock.onGet(apiUrl.PROJECTS_ROUTE).reply(200, projects);

      const expectedActions = [
        { type: A.GET_PROJECTS_REQUEST },
        { type: A.GET_PROJECTS_SUCCESS, payload: projects }
      ];

      return store.dispatch(actions.getProjectsList()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches FAILURE when GET request does not complete', () => {
      axiosMock.onGet(apiUrl.PROJECTS_ROUTE).reply(400);

      const expectedActions = [
        { type: A.GET_PROJECTS_REQUEST },
        { type: A.GET_PROJECTS_FAILURE, err: Error('Request failed with status code 400') }
      ];

      return store.dispatch(actions.getProjectsList()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('getProject', () => {
    it('dispatches SUCCESS when GET request for a single project has been completed', () => {
      const project = { id: '1234', name: 'ATP', tickets: [{ 'id': '111', 'name': 'Log Bug' }, { 'id': '222', 'name': 'Issue' }] };

      axiosMock.onGet(apiUrl.PROJECTS_ROUTE + '/ATP').reply(200, project);

      const expectedActions = [
        { type: A.GET_PROJECT_REQUEST },
        { type: A.GET_PROJECT_SUCCESS, payload: project }
      ];

      return store.dispatch(actions.getProject('ATP')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches FAILURE when GET request does not complete', () => {
      axiosMock.onGet(apiUrl.PROJECTS_ROUTE + '/NONE').reply(404);

      const expectedActions = [
        { type: A.GET_PROJECT_REQUEST },
        { type: A.GET_PROJECT_FAILURE, err: Error('Request failed with status code 404') }
      ];

      return store.dispatch(actions.getProject()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('createProject', () => {
    it('dispatches SUCCESS when POST request has been completed', () => {
      const expectedCreatedProject = { id: '333', name: 'FIFA', tickets: [] };

      axiosMock.onPost(apiUrl.PROJECTS_ROUTE).reply(201, expectedCreatedProject);

      const expectedActions = [
        { type: A.CREATE_PROJECT_REQUEST },
        { type: A.CREATE_PROJECT_SUCCESS, payload: expectedCreatedProject }
      ];

      return store.dispatch(actions.createProject('FIFA')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches FAILURE when POST request does not complete', () => {
      axiosMock.onPost(apiUrl.PROJECTS_ROUTE).reply(400);

      const expectedActions = [
        { type: A.CREATE_PROJECT_REQUEST },
        { type: A.CREATE_PROJECT_FAILURE, err: Error('Request failed with status code 400') }
      ];

      return store.dispatch(actions.createProject()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('updateProject', () => {
    it('dispatches SUCCESS when POST request has been completed', () => {
      const updatedProject = { id: '333', name: 'FIFA', tickets: [{ id: '4443', name: 'Log Bug2' }] };

      axiosMock.onPost(apiUrl.PROJECTS_ROUTE + '/FIFA').reply(204);

      const expectedActions = [
        { type: A.UPDATE_PROJECT_REQUEST },
        { type: A.UPDATE_PROJECT_SUCCESS, payload: updatedProject }
      ];

      return store.dispatch(actions.updateProject('FIFA', updatedProject))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('dispatches FAILURE when POST request does not complete', () => {
      const updatedProject = { id: '333', name: 'FIFA', tickets: [{ id: '4443', name: 'Log Bug2' }] };

      axiosMock.onPost(apiUrl.PROJECTS_ROUTE).reply(404);

      const expectedActions = [
        { type: A.UPDATE_PROJECT_REQUEST },
        { type: A.UPDATE_PROJECT_FAILURE, err: Error('Request failed with status code 404') }
      ];

      return store.dispatch(actions.updateProject('FIFA', updatedProject))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('deleteProject', () => {
    it('dispatches SUCCESS when DELETE request has been completed', () => {
      axiosMock.onDelete(apiUrl.PROJECTS_ROUTE + '/FIFA').reply(204);

      const expectedActions = [
        { type: A.DELETE_PROJECT_REQUEST },
        { type: A.DELETE_PROJECT_SUCCESS, payload: 'FIFA' }
      ];

      return store.dispatch(actions.deleteProject('FIFA')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches FAILURE when DELETE request does not complete', () => {
      axiosMock.onDelete(apiUrl.PROJECTS_ROUTE + '/FIFA').reply(404);

      const expectedActions = [
        { type: A.DELETE_PROJECT_REQUEST },
        { type: A.DELETE_PROJECT_FAILURE, err: Error('Request failed with status code 404') }
      ];

      return store.dispatch(actions.deleteProject('FIFA')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
