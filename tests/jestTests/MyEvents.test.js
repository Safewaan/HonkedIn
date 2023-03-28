import React from 'react';
import { render, screen } from '@testing-library/react';
import MyEvents from '../componentsTest/MyEvents';

import '@testing-library/jest-dom/extend-expect';

describe('<myEvents />', () => {

  it('loads my events on first render', async () => {
    const loadGetEventsByUser = jest.fn().mockName('loadGetMyEvents');
    const events = [];

    render(<MyEvents loadGetEventsByUser={loadGetEventsByUser} events={events} />);
    expect(loadGetEventsByUser).toHaveBeenCalled();
  });

  it('displays the number of participants', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      }
    ]

    render(<MyEvents loadGetEventsByUser={noop} events={events} />);
    expect(screen.getByText('Participants: 0 / 100')).toBeInTheDocument();
  });

  it('displays active if the event is active', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      }
    ]

    render(<MyEvents loadGetEventsByUser={noop} events={events} />);
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
  });
});