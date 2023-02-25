import React from 'react';
import Events from '../componentsTest/Events';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

describe('<Events />', () => {

  it('loads events on first render', () => {
    const loadGetEvents = jest.fn().mockName('loadGetEvents');
    const events = [];
    render(<Events loadGetEvents={loadGetEvents} events={events} />);
    expect(loadGetEvents).toHaveBeenCalled();
  });

  it('displays the events titles', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      },
      {
        "id": 2, "creatorID": 1, "name": "Test Event 2", "description": "Test Description 2", "location": "Test Location 2",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      }
    ];

    render(<Events loadGetEvents={noop} events={events} />);
    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
  });

  it('displays the date of the event', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      }
    ]

    render(<Events loadGetEvents={noop} events={events} />);
    const string = new Date(new Date('2023-02-23T05:00:00.000Z').getTime() - (5 * 60 * 60 * 1000)).toLocaleString();
    expect(screen.getByText(`Date: ${string}`)).toBeInTheDocument();
  });

  it('displays the number of participants', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      }
    ]

    render(<Events loadGetEvents={noop} events={events} />);
    expect(screen.getByText('Participants: 0 / 100')).toBeInTheDocument();
  });

  it('displays "Active" if the event is active', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Active"
      }
    ];

    render(<Events loadGetEvents={noop} events={events} />);
    expect(screen.getByText('Status: Active')).toBeInTheDocument();
  });

  it('displays "Cancelled" if the event is cancelled', () => {
    const noop = () => { };
    const events = [
      {
        "id": 1, "creatorID": 1, "name": "Test Event 1", "description": "Test Description 1", "location": "Test Location 1",
        "date": "2023-02-23T05:00:00.000Z", "participants": 0, "totalParticipants": 100, "status": "Cancelled"
      }
    ];

    render(<Events loadGetEvents={noop} events={events} />);
    expect(screen.getByText('Status: Cancelled')).toBeInTheDocument();
  });
});