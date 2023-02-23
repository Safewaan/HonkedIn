import React from 'react';
import { render, screen } from '@testing-library/react';
import Forum from '../componentsTest/ForumTest'

describe('<ForumTest />', () => {

  it('loads comments on first render', async () => {
    global.fetch = jest.fn(() => {
      Promise.resolve();
    })

    const loadGetForumCommentsByForumID = jest.fn().mockName('loadGetForumCommentsByForumID');
    render(<Forum loadGetForumCommentsByForumID={loadGetForumCommentsByForumID}/>);
    expect(loadGetForumCommentsByForumID).toHaveBeenCalled();

  });

  it('displays the date of a comment ', () => {
    const date = () => { };
    const comments = [
      {
        "id": 1, "forumID": 1, "userID": "1", "commentDateTime": "2023-02-23T05:00:00.000Z", "comment": "Test 1"
      }
    ]

    render(<Forum loadGetForumCommentsByForumID={date} comments={comments} />);
    expect(screen.getByText('2/23/2023')).toBeInTheDocument();
  });
});

