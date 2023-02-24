import React from 'react';
 import { render, screen } from '@testing-library/react';
 import MyEvents from '../componentsTest/MyEvents';

 describe('<myEvents />', () => {

   it('loads my events on first render', async () => {
     global.fetch = jest.fn(() => {
       Promise.resolve();
     })
     const loadGetMyEvents = jest.fn().mockName('loadGetMyEvents');
     render(<MyEvents loadGetMyEvents={loadGetMyEvents} />);
     expect(loadGetMyEvents).toHaveBeenCalled();
    });

    it('displays the number of participants', () => {
      const noop = () => { };
      const myEvents = [
        {
          "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
          "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
        }
      ]

      render(<MyEvents loadGetMyEvents={noop} myEvents={myEvents} />);
      expect(screen.getByText('Participants: 0 / 100')).toBeInTheDocument();
    });
 
    it('displays active if the event is active', () => {
      const noop = () => { };
      const myEvents = [
        {
          "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
          "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
        }
      ]
 
      render(<MyEvents loadGetMyEvents={noop} myEvents={myEvents} />);
      expect(screen.getByText('Status: Active')).toBeInTheDocument();
    });
  });