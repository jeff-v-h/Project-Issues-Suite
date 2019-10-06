import projectsReducer from './projects-reducer';
import { ACTIONS as A } from '../config/constants';

describe('projects-reducer', () => {
  // re-usable variables
  let prevState;
  let action;
  let expectedState;
  const initialState = { inProgress: false, data: [], selected: {}, error: {} };
  const inProgressState = { inProgress: true, data: [], selected: {}, error: {} };
  const errorState = { inProgress: false, data: [], selected: {}, error: Error('Request failed with status code 400') };

  it('should return the initial state', () => {
    action = {};

    expect(projectsReducer(undefined, action)).toEqual(initialState);
  });

  describe('CREATE_PROJECT action types', () => {
    it('should handle REQUEST', () => {
      action = { type: A.CREATE_PROJECT_REQUEST };
      expectedState = { inProgress: true };

      expect(projectsReducer({}, action)).toEqual(expectedState);
    });

    it('should handle SUCCESS', () => {
      action = { type: A.CREATE_PROJECT_SUCCESS, payload: { id: '333', name: 'FIFA', tickets: [] } };
      expectedState = { inProgress: false, data: [{ id: '333', name: 'FIFA', tickets: [] }], selected: {}, error: {} };

      expect(projectsReducer(inProgressState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.CREATE_PROJECT_FAILURE, payload: Error('Request failed with status code 400') };

      expect(projectsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('GET_PROJECTS action types', () => {
    it('should handle REQUEST', () => {
      prevState = { inProgress: false, data: [{ id: '333', name: 'FIFA', tickets: [] }], selected: {}, error: {} };
      action = { type: A.GET_PROJECTS_REQUEST };
      expectedState = { inProgress: true, data: [{ id: '333', name: 'FIFA', tickets: [] }], selected: {}, error: {} };

      expect(projectsReducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle SUCCESS', () => {
      action = { type: A.GET_PROJECTS_SUCCESS, payload: [{ id: '333', name: 'FIFA', tickets: [] }, { id: '111', name: 'PGA', tickets: [] }] };
      expectedState = {
        inProgress: false,
        data: [{ id: '333', name: 'FIFA', tickets: [] }, { id: '111', name: 'PGA', tickets: [] }],
        selected: {},
        error: {}
      };

      expect(projectsReducer(inProgressState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.GET_PROJECTS_FAILURE, payload: Error('Request failed with status code 400') };

      expect(projectsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('UPDATE_PROJECT action types', () => {
    it('should handle REQUEST', () => {
      action = { type: A.UPDATE_PROJECT_REQUEST };

      expect(projectsReducer(initialState, action)).toEqual(inProgressState);
    });

    it('should handle SUCCESS', () => {
      action = { type: A.UPDATE_PROJECT_SUCCESS };
      expectedState = { inProgress: false, data: [], selected: {}, error: {} };

      expect(projectsReducer(inProgressState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.UPDATE_PROJECT_FAILURE, payload: Error('Request failed with status code 400') };

      expect(projectsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('DELETE_PROJECT action types', () => {
    it('should handle REQUEST', () => {
      action = { type: A.DELETE_PROJECT_REQUEST };

      expect(projectsReducer(initialState, action)).toEqual(inProgressState);
    });

    it('should handle SUCCESS', () => {
      action = { type: A.DELETE_PROJECT_SUCCESS };
      expectedState = { inProgress: false, data: [], selected: {}, error: {} };

      expect(projectsReducer(inProgressState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.DELETE_PROJECT_FAILURE, payload: Error('Request failed with status code 400') };

      expect(projectsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('SELECT_PROJECT', () => {
    it('should update the store with the provided project', () => {
      action = { type: A.SELECT_PROJECT, payload: { id: '111', name: 'ATP', tickets: [] } };
      expectedState = { inProgress: false, data: [], selected: { id: '111', name: 'ATP', tickets: [] }, error: {} };

      expect(projectsReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('CLEAR_PROJECT_LIST', () => {
    it('should clear the data store', () => {
      prevState = { inProgress: false, data: [{ id: '111', name: 'ATP', tickets: [] }], selected: {}, error: {} };
      action = { type: A.CLEAR_PROJECT_LIST };

      expect(projectsReducer(prevState, action)).toEqual(initialState);
    });
  });
});
