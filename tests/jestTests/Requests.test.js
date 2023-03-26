import React from 'react';
import Requests from '../componentsTest/Requests';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

describe('<Requests />', () => {

  const sentRequests = [
    {
      "request_id": 1, "sender_name": "Sender", "receiver_name": "Receiver", "body": "Test 1"
    },
  ];

  const receivedRequests = [
    {
      "request_id": 1, "sender_name": "Sender", "receiver_name": "Receiver", "body": "Test 1"
    },
  ]

  it('loads correct number of sent requests', () => {
    render(<Requests sentRequests={sentRequests} receivedRequests={[]} />);

    const toElements = screen.queryAllByText('To:');
    expect(toElements.length).toEqual(sentRequests.length);

    const forElements = screen.queryAllByText('From:');
    expect(forElements.length).toEqual(0);
  });

  it('loads correct number of received requests', () => {
    render(<Requests sentRequests={[]} receivedRequests={receivedRequests} />);

    const toElements = screen.queryAllByText('To:');
    expect(toElements.length).toEqual(0);

    const forElements = screen.queryAllByText('From:');
    expect(forElements.length).toEqual(receivedRequests.length);
  });

  it('loads requests correctly', () => {
    render(<Requests sentRequests={sentRequests} receivedRequests={[]} />);

    expect(screen.getByText('Receiver')).toBeInTheDocument();
    expect(screen.getByText('Test 1')).toBeInTheDocument();
  });
});