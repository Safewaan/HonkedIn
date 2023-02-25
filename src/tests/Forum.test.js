import React from 'react';
import { render, screen } from '@testing-library/react';
import Forum from '../componentsTest/Forum'

import '@testing-library/jest-dom/extend-expect';


describe('<Forum />', () => {

  const forums = [
      {
        "forumID": 1, "creatorID": 1, "forumTitle": "First Forum Title Test", "description": "First Test Forum Description",
        "dateTime": "2023-02-24T05:00:00.000Z", "status": "Active"
      }
    ];

  it('loads comments on first render', async () => {
    global.fetch = jest.fn(() => {
      Promise.resolve();
    })


    const comments = []; 

    const loadGetForumCommentsByForumID = jest.fn().mockName('loadGetForumCommentsByForumID');
    render(<Forum loadGetForumCommentsByForumID={loadGetForumCommentsByForumID} comments={comments} forums={forums}/>);
    expect(loadGetForumCommentsByForumID).toHaveBeenCalled();

  });

  it('displays the time and date of the comment', () => {

    const noop = () => { };

    const comments = [
      {
        "id": 1, "forumID": 1, "userID": 2, "commentDateTime": "2023-02-23T05:00:00.000Z", "comment": "Test 2"
      }
    ]

    render(<Forum loadGetForumCommentsByForumID={noop} forums={forums} comments={comments} />);
    const string = new Date(new Date('2023-02-23T05:00:00.000Z').getTime() - (5 * 60 * 60 * 1000)).toLocaleString();
    expect(screen.getByText(`Comment Created:${string}`)).toBeInTheDocument();
  });

});