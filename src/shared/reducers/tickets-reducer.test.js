import ticketsReducer from './tickets-reducer';
import { ACTIONS as A } from '../config/constants';

describe('tickets-reducer', () => {
  // re-usable variables
  let prevState;
  let action;
  let expectedState;
  const initialState = { inProgress: false, data: [], selected: {}, error: {}, deletedId: '', video: {} };
  const inProgressState = { inProgress: true, data: [], selected: {}, error: {}, deletedId: '', video: {} };
  const errorState = { inProgress: false, data: [], selected: {}, error: Error('Request failed with status code 400'), deletedId: '', video: {} };
  const ticket = {
    id: '2222',
    name: 'New Bug',
    description: 'There was an issue',
    projectName: 'PGA',
    videos: []
  };

  it('should return the initial state', () => {
    action = {};

    expect(ticketsReducer(undefined, action)).toEqual(initialState);
  });

  describe('CREATE_TICKET action types', () => {
    it('should handle REQUEST', () => {
      prevState = { inProgress: false, data: [], selected: ticket, error: {}, deletedId: '', video: {} };
      action = { type: A.CREATE_TICKET_REQUEST };

      expect(ticketsReducer(prevState, action)).toEqual(inProgressState);
    });

    it('should handle SUCCESS', () => {
      action = { type: A.CREATE_TICKET_SUCCESS, payload: ticket };
      expectedState = { inProgress: false, data: [ticket], selected: ticket, error: {}, deletedId: '', video: {} };

      expect(ticketsReducer(inProgressState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.CREATE_TICKET_FAILURE, payload: Error('Request failed with status code 400') };

      expect(ticketsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('GET_TICKET action types', () => {
    it('should handle REQUEST', () => {
      action = { type: A.GET_TICKET_REQUEST };

      expect(ticketsReducer(initialState, action)).toEqual(inProgressState);
    });

    it('should handle SUCCESS', () => {
      action = { type: A.GET_TICKET_SUCCESS, payload: ticket };
      expectedState = { inProgress: false, data: [ticket], selected: ticket, error: {}, deletedId: '', video: {} };

      expect(ticketsReducer(inProgressState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.GET_TICKET_FAILURE, payload: Error('Request failed with status code 400') };

      expect(ticketsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('UPDATE_TICKET action types', () => {
    it('should handle REQUEST', () => {
      action = { type: A.UPDATE_TICKET_REQUEST };

      expect(ticketsReducer(initialState, action)).toEqual(inProgressState);
    });

    it('should handle SUCCESS', () => {
      const ticket2 = {
        id: '3333',
        name: 'Minor issue',
        description: 'The problem recreated',
        projectName: 'ATP',
        videos: []
      };

      const updatedTicket2 = {
        id: '3333',
        name: 'Minor issue',
        description: 'The problem recreated another way',
        projectName: 'ATP',
        videos: []
      };

      prevState = { inProgress: false, data: [ticket, ticket2], selected: ticket2, error: {}, deletedId: '', video: {} };
      action = { type: A.UPDATE_TICKET_SUCCESS, payload: updatedTicket2 };
      expectedState = { inProgress: false, data: [ticket, updatedTicket2], selected: updatedTicket2, error: {}, deletedId: '', video: {} };

      expect(ticketsReducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.UPDATE_TICKET_FAILURE, payload: Error('Request failed with status code 400') };

      expect(ticketsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('DELETE_TICKET action types', () => {
    it('should handle REQUEST', () => {
      action = { type: A.DELETE_TICKET_REQUEST };

      expect(ticketsReducer(initialState, action)).toEqual(inProgressState);
    });

    it('should handle SUCCESS', () => {
      const ticket2 = {
        id: '3333',
        name: 'Minor issue',
        description: 'The problem recreated',
        projectName: 'ATP',
        videos: []
      };

      prevState = { inProgress: true, data: [ticket, ticket2], selected: ticket2, error: {}, deletedId: '', video: {} };
      action = { type: A.DELETE_TICKET_SUCCESS, payload: ticket2.id };
      expectedState = { inProgress: false, data: [ticket], selected: {}, error: {}, deletedId: ticket2.id, video: {} };

      expect(ticketsReducer(prevState, action)).toEqual(expectedState);
    });

    it('should handle FAILURE', () => {
      action = { type: A.DELETE_TICKET_FAILURE, payload: Error('Request failed with status code 400') };

      expect(ticketsReducer(inProgressState, action)).toEqual(errorState);
    });
  });

  describe('SELECT_TICKET', () => {
    it('should update the store with the provided ticket', () => {
      action = { type: A.SELECT_TICKET, payload: ticket };
      expectedState = { inProgress: false, data: [], selected: ticket, error: {}, deletedId: '', video: {} };

      expect(ticketsReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('SELECT_VIDEO', () => {
    it('should update the store with the provided video', () => {
      const ticketWithVideo = {
        id: '7777',
        name: 'Ticket name',
        description: 'Another bug found',
        projectName: 'PGA',
        videos: [
          {
            id: "987",
            title: "Bug Recreated",
            description: "double click doesn't work",
            url: "www.d3videos.com",
            length: "00:00:00"
          }
        ]
      };

      action = { type: A.SELECT_VIDEO, payload: ticketWithVideo.videos[0] };
      expectedState = { inProgress: false, data: [], selected: {}, error: {}, deletedId: '', video: ticketWithVideo.videos[0] };

      expect(ticketsReducer(initialState, action)).toEqual(expectedState);
    });
  });
});
