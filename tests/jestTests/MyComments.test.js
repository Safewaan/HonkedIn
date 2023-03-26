import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComments from '../componentsTest/MyComments'

import '@testing-library/jest-dom/extend-expect';


describe('<MyComments />', () => {

    it('loads comments on first render on myComments page', () => {
        const loadGetComments = jest.fn().mockName('loadGetComments');
        const myComments = [];
        render(<MyComments loadGetComments={loadGetComments} myComments={myComments} />);
        expect(loadGetComments).toHaveBeenCalled();
    });

  it('displays the time and date of the comment on myComments page', () => {

    const noop = () => { };

    const myComments = [
      {
        "id": 1, "forumID": 1, "userID": 2, "commentDateTime": "2023-02-23T05:00:00.000Z", "comment": "Test 2"
      }
    ]

    render(<MyComments loadGetComments={noop} myComments={myComments} />);
    const string = new Date(new Date('2023-02-23T05:00:00.000Z').getTime() - (4 * 60 * 60 * 1000)).toLocaleString();
    expect(screen.getByText(`Commented on ${string}`)).toBeInTheDocument();
  });

});